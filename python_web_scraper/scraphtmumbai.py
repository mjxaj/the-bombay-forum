from bs4 import BeautifulSoup
import requests
import pymysql
import hashlib
import os
from dotenv import load_dotenv

load_dotenv()

class ScrapHTMumbai:
    def __init__(self):
        self.url = "https://www.hindustantimes.com/mumbai-news"
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36"
        }
        self.db_config = {
            'host': os.getenv('MYSQL_HOST'),
            'port': int(os.getenv('MYSQL_PORT')),
            'user': os.getenv('MYSQL_USER'),
            'password': os.getenv('MYSQL_PASSWORD'),
            'database': os.getenv('MYSQL_DATABASE')
        }

    def generate_article_id(self, title: str) -> str:
        title_slug = ''.join(c if c.isalnum() else '-' for c in title.lower())
        suffix = hashlib.md5(title.encode()).hexdigest()[:7]
        return f"{title_slug}-{suffix}"

    def fetch_data(self):
        try:
            response = requests.get(self.url, headers=self.headers)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')
            hdg3_elements = soup.find_all(class_='hdg3')[1:21]
            img_tags = soup.find_all('img', class_='lazy')[4:24]

            urls = []
            bigimg = []
            Desc_list = []
            headings = []
            smallimg = []
            for i in range(1, len(img_tags)):
                if i < len(hdg3_elements):
                    hdg3_text = hdg3_elements[i].text.strip()
                    headings.append(hdg3_text)
                    a_tags = hdg3_elements[i].find_all('a')
                    for a_tag in a_tags:
                        link = a_tag.get('href')
                        if link.startswith('/'):
                            urls.append("https://www.hindustantimes.com" + link)
                        else:
                            urls.append(link)
                    img_src = img_tags[i].get('data-src')
                    if img_src:
                        smallimg.append(img_src)
                        bigimg.append(img_src.replace('smallthumbnail', 'mediumthumbnail'))
                    else:
                        smallimg.append(None)
                        bigimg.append(None)
                    Desc_list.append(hdg3_elements[i].get('title', ''))

            return headings, Desc_list, smallimg, bigimg
        except Exception as e:
            print(f"Error fetching data: {str(e)}")
            return [], [], [], []

    def insert_data(self, headings, Desc_list, smallimg, bigimg):
        connection = pymysql.connect(**self.db_config, cursorclass=pymysql.cursors.DictCursor)
        try:
            with connection.cursor() as cursor:
                for i in range(len(headings)):
                    try:
                        article_id = self.generate_article_id(headings[i])
                        check_query = "SELECT COUNT(*) FROM news WHERE ArticleId = %s"
                        cursor.execute(check_query, (article_id,))
                        exists = cursor.fetchone()['COUNT(*)']

                        if exists == 0:
                            insert_query = """
                                INSERT INTO news (ArticleId, Title, Description, Sphoto, Lphoto, Type, Num)
                                VALUES (%s, %s, %s, %s, %s, %s, %s)
                            """
                            values = (article_id, headings[i], Desc_list[i], smallimg[i], bigimg[i], 'Mumbai', i + 1)
                            cursor.execute(insert_query, values)
                        else:
                            print(f"Article with ArticleId {article_id} already exists, skipping.")
                    except Exception as e:
                        print(f"Error executing query for record {i + 1}: {str(e)}")
                        connection.rollback()
                connection.commit()
                print("Data inserted successfully")
        except Exception as e:
            print(f"Error with database operations: {str(e)}")
            connection.rollback()
        finally:
            connection.close()

    def run(self):
        headings, Desc_list, smallimg, bigimg = self.fetch_data()
        if headings:
            self.insert_data(headings, Desc_list, smallimg, bigimg)

if __name__ == "__main__":
    scraper = ScrapHTMumbai()
    scraper.run()
