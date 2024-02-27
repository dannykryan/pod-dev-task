import { useState } from 'react';
import { Link } from 'react-router-dom';
import ConfirmationModal from './ConfirmationModal';

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  age: number;
  gender: string;
};

type UserModalProps = {
  user: User | null;
  onClose: () => void;
  isOpen: boolean;
};

const playDeselectSound = () => {
  const audio = new Audio('/public/Audio/deselect-sound.mp3');
  audio.volume = 0.3;
  audio.play();
};

const UserModal: React.FC<UserModalProps> = ({ user, onClose, isOpen }) => {
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  // Function to handle user deletion after confirmation
  const confirmedDeleteUser = () => {
    if (user) {
      const deleteUserUrl = `https://dummyjson.com/users/${user.id}`;
      fetch(deleteUserUrl, {
        method: 'DELETE',
      })
      .then(response => {
        if (response.ok) {
          // Logic after successful deletion
          const deletedUserIds = JSON.parse(localStorage.getItem('deletedUserIds') || '[]');
          deletedUserIds.push(user.id);
          localStorage.setItem('deletedUserIds', JSON.stringify(deletedUserIds));
          onClose(); // Close the UserModal
          playDeselectSound();
          window.location.reload(); // Optionally reload the page or update state
        } else {
          throw new Error('Failed to delete user');
        }
      })
      .catch(error => {
        console.error('Failed to delete user:', error);
      });
    }
  };

  return (
    <>
      <div className={isOpen ? "modal-overlay" : "hidden"}>
        <div className={isOpen ? "modal dark:bg-slate-800" : "hidden"}>
          <div className="relative">
            <div className="flex items-center justify-center">
              <div className={`w-40 h-40 overflow-hidden rounded-md ${user?.gender === 'male' ? 'bg-blue-300' : 'bg-pink-300'}`}>
                <img className="w-full h-full object-cover" src={user?.image} alt="User" />
              </div>
            </div>
            <div 
              className="absolute -top-0.5 -right-1 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md cursor-pointer dark:bg-gray-700 hover:opacity-50" 
              onClick={() => {
                onClose();
                playDeselectSound();
              }}
            >
              <span className="text-black text-2xl dark:text-white" style={{ transform: 'translateY(-3px)' }}>&times;</span>
            </div>
          </div>
          <div className="px-6 py-4">
            <div className="flex items-center justify-center mb-2">
              <p className="font-bold text-xl">{user?.firstName} {user?.lastName}</p>
              <span className={`bg-${user?.gender === "male" ? 'blue' : 'pink'}-300 rounded-full w-4 h-4 flex items-center justify-center text-white text-xs ml-2`}>
                {user?.gender === "male" ? <span style={{ transform: 'translateY(-1px)' }}>♂</span> : <span style={{ transform: 'translateY(-1px)' }}>♀</span>}
              </span>
            </div>
            <a className="dark:text-purple-500" href={`mailto:${user?.email}`}>{user?.email}</a>
          </div>
          <Link to={`/users/${user?.id}/edit`} className="btn py-2 px-4">
            Update Cat
          </Link>
          <button 
            className="btn btn-cancel py-2 px-4"
            onClick={() => setIsConfirmationModalOpen(true)}
          >
            Delete Cat
          </button>
        </div>
      </div>
      <ConfirmationModal 
        isOpen={isConfirmationModalOpen} 
        onClose={() => setIsConfirmationModalOpen(false)} // Close modal without deleting
        onConfirm={confirmedDeleteUser} // Call confirmedDeleteUser on confirmation
        message="Are you sure you want to delete this user?"
      />
    </>
  );
};

export default UserModal;
