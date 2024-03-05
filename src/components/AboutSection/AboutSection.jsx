import AboutItem from "../AboutItem/AboutItem";

const AboutSection = () => {
  return (
    <div className="container my-3">

      <div className="row">

        <AboutItem
          title="Easiy JPEG, JPG and PNG Conversion"
          description="A simple and easiy interface to select your images, Reorder your
              images and download the generated PDF."
        />

        <AboutItem
          title="High Quality PDF"
          description="Your PDF keeps the quality of your images. You will find your PDF without no loss of image quality."
        />

        <AboutItem
          title="Image Managment"
          description="Reorder your images as you want, you can move the selected image up and down to arrange the pages."
        />
      </div>
    </div>
  );
};

export default AboutSection;
