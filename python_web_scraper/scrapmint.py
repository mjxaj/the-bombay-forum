from bs4 import BeautifulSoup
import requests
import json
import pymysql
import os
from dotenv import load_dotenv

load_dotenv()

class LiveMintScraper:
    def __init__(self):
        self.url = "https://www.livemint.com"
        self.db_config = {
            'host': os.getenv('MYSQL_HOST', 'localhost'),
            'port': int(os.getenv('MYSQL_PORT', 3307)),
            'user': os.getenv('MYSQL_USER', 'root'),
            'password': os.getenv('MYSQL_PASSWORD', ''),
            'database': os.getenv('MYSQL_DATABASE', 'tbf')
        }
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36"
        }

    @staticmethod
    def remove_non_bmp_in_place(string):
        """Remove non-BMP characters from the string."""
        char_list = list(string)
        i = 0
        while i < len(char_list):
            if ord(char_list[i]) > 0xFFFF:
                del char_list[i]
            else:
                i += 1
        return ''.join(char_list)

    def fetch_main_page(self):
        """Fetch and parse the main page."""
        try:
            response = requests.get(self.url, headers=self.headers)
            response.raise_for_status()
            return BeautifulSoup(response.text, 'html.parser')
        except requests.RequestException as e:
            print(f"Failed to fetch main page: {str(e)}")
            return None

    def extract_json_data(self, soup):
        """Extract data from the 4th <script> tag of type 'application/ld+json'."""
        script_tags = soup.find_all('script', type='application/ld+json')
        if len(script_tags) >= 4:
            fourth_script_content = script_tags[3].string
            if fourth_script_content:
                try:
                    data = json.loads(fourth_script_content)
                    items = data.get('itemListElement', [])
                    names_list, descriptions_list, urls_list = [], [], []

                    for item in items:
                        name = item.get('name')
                        description = item.get('description', '')
                        url = item.get('url')

                        if name and url:
                            names_list.append(name)
                            urls_list.append(url)
                            descriptions_list.append(description)

                    return names_list, descriptions_list, urls_list
                except json.JSONDecodeError:
                    print("Error: Unable to parse JSON content.")
                    return [], [], []
            else:
                print("Content of the 4th script tag is empty.")
                return [], [], []
        else:
            print("Not enough script tags with type 'application/ld+json'.")
            return [], [], []

    def fetch_article_details(self, urls):
        """Fetch detailed information for each article URL."""
        desc_list, pic_list = [], []

        for url in urls:
            try:
                response = requests.get(url, headers=self.headers)
                if response.status_code == 200:
                    soup = BeautifulSoup(response.content, 'html.parser')
                    
                    # Find the first <picture> tag and get its src attribute
                    picture_tag = soup.find('picture')
                    if picture_tag:
                        source_tag = picture_tag.find('source')
                        src = source_tag['srcset'] if source_tag and 'srcset' in source_tag.attrs else ""
                        if not src:
                            img_tag = picture_tag.find('img')
                            src = img_tag['src'] if img_tag and 'src' in img_tag.attrs else "assets/img/clock.png"
                        pic_list.append(src)
                    else:
                        pic_list.append("assets/img/clock.png")
                        print(f"No <picture> tag found in {url}.")
                    
                    # Extract the description
                    main_area_div = soup.find('div', class_='mainArea')
                    if main_area_div:
                        paragraphs = main_area_div.find_all('p')
                        desc_text = ''
                        for paragraph in paragraphs:
                            if 'milestone' in paragraph.get('class', []):
                                break
                            desc_text += paragraph.get_text(strip=True) + '\n\n'
                        desc_list.append(desc_text)
                    else:
                        desc_list.append("No div with class 'mainArea' found.")
                        print(f"No div with class 'mainArea' found in {url}.")
                else:
                    print(f"Failed to retrieve {url}. Status code: {response.status_code}")
            except Exception as e:
                print(f"Error occurred while processing {url}: {str(e)}")

        return desc_list, pic_list

    def update_database(self, names_list, desc_list, pic_list):
        """Update the database with the fetched data."""
        connection = pymysql.connect(**self.db_config, cursorclass=pymysql.cursors.DictCursor)

        try:
            with connection.cursor() as cursor:
                for i in range(min(len(names_list), len(desc_list), len(pic_list))):
                    try:
                        update_query = """
                            UPDATE news
                            SET Title = %s, Description = %s, Sphoto = '', Lphoto = %s
                            WHERE Type = %s AND Num = %s
                        """
                        values = (names_list[i], desc_list[i], pic_list[i], 'Finance', i + 1)
                        # print("Executing query:", update_query)
                        # print("With values:", values)
                        cursor.execute(update_query, values)
                    except Exception as e:
                        print(f"Error executing query for record {i + 1}: {str(e)}")
                        connection.rollback()

                connection.commit()
                print("Data updated successfully")
        except Exception as e:
            print(f"Error with database operations: {str(e)}")
            connection.rollback()
        finally:
            connection.close()

    def run(self):
        soup = self.fetch_main_page()
        if not soup:
            return

        names_list, desc_list, urls_list = self.extract_json_data(soup)
        if not names_list:
            print("No data to update.")
            return

        desc_list, pic_list = self.fetch_article_details(urls_list)
        desc_list = [self.remove_non_bmp_in_place(desc) for desc in desc_list]

        self.update_database(names_list, desc_list, pic_list)

if __name__ == "__main__":
    scraper = LiveMintScraper()
    scraper.run()
