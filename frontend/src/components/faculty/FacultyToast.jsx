import { toast, ToastContainer, Zoom } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const baseOptions = {
  position: "bottom-right",
  autoClose: 3500,
  closeOnClick: true,
  hideProgressBar: false,

  pauseOnHover: true,
  draggable: false,
  transition: Zoom,
};

const toastTypeStyles = {
  success: "bg-green-600 text-white",
  error: "bg-red-600 text-white",
};

export const showFacultyToast = (message, type) => {
  {type == "success" ? 
    toast.success(message, {
      ...baseOptions,
      className: "bg-green-600 text-white rounded-md shadow-md",
      bodyClassName: "text-sm font-medium",
      icon: false,
    }) :
    toast.error(message, {
      ...baseOptions,
      className: "bg-red-600 text-white rounded-md shadow-md",
      bodyClassName: "text-sm font-medium",
      icon: false,
    })
  }
};


export const FacultyToastContainer = () => (
  <ToastContainer limit={3} newestOnTop closeButton={false} theme="colored" />
);
