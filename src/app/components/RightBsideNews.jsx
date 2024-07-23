import "/assets/css/Home.scss";
import NewsBlock from "./NewsBlock";
export default function RightAsideNews({ latestNews }) {
  const news = {
    title:
      "Home decor tips to transform your living space into summer sanctuary",
    description:
      "As the summer sun casts its warm glow, it is time to revitalise your living space into a tranquil oasis that echoes the essence of the season. With the right furniture fabrics and colours, you can transform your home into a summer sanctuary that radiates comfort and style.\n\nDrawing inspiration from global trends and insights, Mangala Patil and Varsha Yashvant, Co-Founders of VAASA, highlighted in an interview with HT Lifestyle, recommended how to infuse your living space with the vibrant energy of summer -\n\n1. Global Trends: A Shift Towards Lightness and Sustainability\n\nAcross the globe, there's a noticeable trend towards embracing lightness and sustainability in interior design. As we strive to cultivate spaces that promote serenity and well-being, natural materials and eco-conscious practices have emerged as key elements of contemporary design trends.\n\n2. Natural Materials for a Refreshing Aura\n\nIncorporating natural elements such as rattan, bamboo, and reclaimed wood into furniture design not only adds visual interest but also infuses your space with a sense of earthiness and warmth. Crafted with precision and care, these elements seamlessly blend tradition with modern sensibilities, enhancing the ambiance of any room.\n\n3. The Power of Fabric: Lightweight and Breathable\n\nChoosing the right fabrics is essential for creating a summer sanctuary. Opt for lightweight and breathable materials like linen, cotton, and sheer voile to foster an airy and inviting atmosphere. Thoughtfully selected upholstery fabrics embody these qualities, ensuring both comfort and style without compromising on quality.\n\n4. Embracing the Colors of Summer\n\nInfuse your living space with the vibrant hues of summer to evoke feelings of joy and relaxation. From sun-drenched yellows to cool ocean blues, summer colors bring a sense of vitality and warmth to any room. Explore a diverse palette of shades that inspire creativity and rejuvenation, reflecting the essence of the season.\n\n5. Creating Your Summer Retreat\n\nTransforming your living space into a summer sanctuary is an opportunity to express your personal style while embracing trends that resonate with you. Whether you're drawn to the natural allure of rattan furniture or the refreshing appeal of linen upholstery, there are endless options available to suit your aesthetic preferences and lifestyle.\n\nBringing her expertise to the same, home decor stylist Kaajal Tyagi, added to the list of simple yet effective strategies to transform our homes into soothing summer sanctuaries -\n\nTry these carefully curated tips, we aim to inspire readers to create inviting summer retreats within their homes this summer. By effortlessly blending style and comfort, we can transform our living spaces into havens where we can unwind and escape the heat in style. Let's create spaces that not only look beautiful but also feel refreshingly cool during these summers.",
    sphoto:
      "https://images.hindustantimes.com/img/2024/07/18/148x111/21_1721310802438_1721310823889.png",
    lphoto:
      "https://images.hindustantimes.com/img/2024/07/20/550x309/su_1721487259942_1721487273730.jpg",
  };
  const news2 = {
    title:
      "Home decor tips to transform your living space into summer sanctuary",
    description:
      "As the summer sun casts its warm glow, it is time to revitalise your living space into a tranquil oasis that echoes the essence of the season. With the right furniture fabrics and colours, you can transform your home into a summer sanctuary that radiates comfort and style.\n\nDrawing inspiration from global trends and insights, Mangala Patil and Varsha Yashvant, Co-Founders of VAASA, highlighted in an interview with HT Lifestyle, recommended how to infuse your living space with the vibrant energy of summer -\n\n1. Global Trends: A Shift Towards Lightness and Sustainability\n\nAcross the globe, there's a noticeable trend towards embracing lightness and sustainability in interior design. As we strive to cultivate spaces that promote serenity and well-being, natural materials and eco-conscious practices have emerged as key elements of contemporary design trends.\n\n2. Natural Materials for a Refreshing Aura\n\nIncorporating natural elements such as rattan, bamboo, and reclaimed wood into furniture design not only adds visual interest but also infuses your space with a sense of earthiness and warmth. Crafted with precision and care, these elements seamlessly blend tradition with modern sensibilities, enhancing the ambiance of any room.\n\n3. The Power of Fabric: Lightweight and Breathable\n\nChoosing the right fabrics is essential for creating a summer sanctuary. Opt for lightweight and breathable materials like linen, cotton, and sheer voile to foster an airy and inviting atmosphere. Thoughtfully selected upholstery fabrics embody these qualities, ensuring both comfort and style without compromising on quality.\n\n4. Embracing the Colors of Summer\n\nInfuse your living space with the vibrant hues of summer to evoke feelings of joy and relaxation. From sun-drenched yellows to cool ocean blues, summer colors bring a sense of vitality and warmth to any room. Explore a diverse palette of shades that inspire creativity and rejuvenation, reflecting the essence of the season.\n\n5. Creating Your Summer Retreat\n\nTransforming your living space into a summer sanctuary is an opportunity to express your personal style while embracing trends that resonate with you. Whether you're drawn to the natural allure of rattan furniture or the refreshing appeal of linen upholstery, there are endless options available to suit your aesthetic preferences and lifestyle.\n\nBringing her expertise to the same, home decor stylist Kaajal Tyagi, added to the list of simple yet effective strategies to transform our homes into soothing summer sanctuaries -\n\nTry these carefully curated tips, we aim to inspire readers to create inviting summer retreats within their homes this summer. By effortlessly blending style and comfort, we can transform our living spaces into havens where we can unwind and escape the heat in style. Let's create spaces that not only look beautiful but also feel refreshingly cool during these summers.",
    lphoto:
      "https://images.hindustantimes.com/img/2024/07/20/550x309/su_1721487259942_1721487273730.jpg",
  };
  console.log({ latestNews });

  return (
    <aside className="left-aside">
      <div className="new-list-block">
        <div className="heading">Latest News</div>
        <div className="body">
          {latestNews.map((article, i) => (
            <>
              <NewsBlock news={article} key={i} />
              <hr />
            </>
          ))}
        </div>
      </div>
    </aside>
  );
}
