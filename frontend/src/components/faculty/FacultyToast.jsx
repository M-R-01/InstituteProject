import { toast, ToastContainer, Zoom } from 'react-toastify';
import { FaChalkboardTeacher } from 'react-icons/fa';

const baseOptions = {
  position: "bottom-left",
  autoClose: 3500,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: false,
  transition: Zoom,
};

export const showFacultyToast = (message, type = "success") => {
  toast(
    <div className="flex items-center gap-3">
      <FaChalkboardTeacher size={20} className="text-blue-600" />
      <span>
        <strong>FLASH-NOTE</strong> {message}
      </span>
    </div>,
    { ...baseOptions, type, theme: "light" }
  );
};

export const FacultyToastContainer = () => (
  <ToastContainer limit={3} newestOnTop closeButton theme="light" />
);