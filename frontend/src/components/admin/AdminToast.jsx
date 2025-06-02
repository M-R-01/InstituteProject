import { toast, ToastContainer, Slide } from 'react-toastify';
import { MdSupervisorAccount } from 'react-icons/md';

const baseOptions = {
  position: "top-right",
  autoClose: 3500,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  transition: Slide,
};

export const showAdminToast = (message, type = "info") => {
  toast(
    <div className="flex items-center gap-3">
      <MdSupervisorAccount size={22} className="text-blue-500" />
      <span>
        <strong>Admin Panel</strong> {message}
      </span>
    </div>,
    { ...baseOptions, type, theme: "colored" }
  );
};

export const AdminToastContainer = () => (
  <ToastContainer limit={2} newestOnTop closeButton theme="colored" />
);