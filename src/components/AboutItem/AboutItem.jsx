/* eslint-disable react/prop-types */
import './AboutItem.css'
const AboutItem = ({ title, description }) => {
  return (
    <div className="col-12 col-md-4 my-1">
      <div className="card card-body w-100 h-100">
        <h5 className="font-weight-bold">{title}</h5>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default AboutItem;
