from bs4 import BeautifulSoup
import requests
import pymysql
import os
from dotenv import load_dotenv

load_dotenv()

class ScrapMintCompanies:
    def __init__(self):
        self.url = "https://www.livemint.com/companies"
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

    def fetch_page(self, url):
        """Fetch and parse the webpage content."""
        try:
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            return BeautifulSoup(response.content, 'html.parser')
        except requests.RequestException as e:
            print(f"Failed to fetch {url}: {str(e)}")
            return None

    def fetch_data(self):
        """Fetch data from the main URL."""
        soup = self.fetch_page(self.url)
        if not soup:
            return [], [], [], []

        simgs, titles, urls = [], [], []
        divs = soup.find_all("div", class_="listtostory clearfix")
        
        for div in divs:
            for thumbnail_div in div.find_all("div", class_="thumbnail"):
                img_tag = thumbnail_div.find("img")
                if img_tag and 'src' in img_tag.attrs:
                    simgs.append(img_tag['src'])
            
            for h2_tag in div.find_all("h2", class_="headline"):
                anchor_tag = h2_tag.find("a")
                if anchor_tag:
                    titles.append(anchor_tag.text.strip())
                    urls.append("https://www.livemint.com" + anchor_tag['href'])
        
        return titles, simgs, urls

    def fetch_article_details(self, urls):
        """Fetch detailed information for each article."""
        desc_list, pic_list = []

        for url in urls:
            soup = self.fetch_page(url)
            if not soup:
                desc_list.append("Failed to retrieve article.")
                pic_list.append("assets/img/clock.png")
                continue

            picture_tag = soup.find('picture')
            if picture_tag:
                source_tag = picture_tag.find('source')
                if source_tag and 'srcset' in source_tag.attrs:
                    pic_list.append(source_tag['srcset'])
                else:
                    img_tag = picture_tag.find('img')
                    pic_list.append(img_tag['src'] if img_tag and 'src' in img_tag.attrs else "assets/img/clock.png")
            else:
                pic_list.append("assets/img/clock.png")

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
                desc_list.append("No content found.")
        
        return desc_list, pic_list

    def update_database(self, titles, desc_list, simgs, pic_list):
        """Update the database with the fetched data."""
        connection = pymysql.connect(**self.db_config, cursorclass=pymysql.cursors.DictCursor)

        try:
            with connection.cursor() as cursor:
                for i in range(min(len(titles), len(desc_list), len(simgs), len(pic_list))):
                    try:
                        update_query = """
                            UPDATE news
                            SET Title = %s, Description = %s, Sphoto = %s, Lphoto = %s
                            WHERE Type = %s AND Num = %s
                        """
                        values = (titles[i], desc_list[i], simgs[i], pic_list[i], 'Finance', i + 1)
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
        titles, simgs, urls = self.fetch_data()
        if not titles:
            print("No data to update.")
            return

        desc_list, pic_list = self.fetch_article_details(urls)
        desc_list = [self.remove_non_bmp_in_place(desc) for desc in desc_list]

        self.update_database(titles, desc_list, simgs, pic_list)

if __name__ == "__main__":
    scraper = ScrapLiveMint()
    scraper.run()
