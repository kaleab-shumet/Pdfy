/* eslint-disable react/prop-types */
import './AboutItem.css'
const AboutItem = ({ title, description }) => {
  return (
    <div className="col">
      <div className="card card-body p-3 my-2 about-item">
        <h5 className="font-weight-bold">{title}</h5>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default AboutItem;
