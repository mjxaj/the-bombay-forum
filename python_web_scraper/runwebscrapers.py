from scraphtlifestyle import ScrapHTLifestyle
from scraphtmumbai import ScrapHTMumbai
from scraphttech import ScrapHTTech
from scrapmintcompanies import ScrapMintCompanies
from scrapmint import LiveMintScraper

def main():
    scrapers = [
        ScrapHTLifestyle(),
        ScrapHTMumbai(),
        ScrapHTTech(),
        ScrapMintCompanies(),
        LiveMintScraper()
    ]
    
    for scraper in scrapers:
        try:
            scraper.run()
        except Exception as e:
            print(f"Error running {scraper.__class__.__name__}: {str(e)}")
            continue

if __name__ == "__main__":
    main()
