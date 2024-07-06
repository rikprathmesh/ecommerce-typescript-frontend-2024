import loaderIcon from "../assets/loader-img.webp";

const Loader = () => {
  return (
    <div className="loader-container">
      <img src={loaderIcon} alt="Loading" className="loader-icon" />
    </div>
  );
};

export default Loader;

interface SkeletonProps {
  width?: string;
  length?: number
}

export const Skeleton = ({ width = "unset", length = 3 }: SkeletonProps) => {

  const skeletion = Array.from({length}, (_, idx) => (
    <div key={idx} className="skeleton-shape"></div>
  ))
  return (
    <div className="skeleton-loader" style={{ width }}>
      {skeletion}
    </div>
  );
};
