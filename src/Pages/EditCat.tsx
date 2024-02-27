import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ConfirmationModal from '../Components/ConfirmationModal';

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  age: number;
  gender: string;
};

export default function EditUser() {
  const { userId } = useParams<string>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentAction, setCurrentAction] = useState('');

  useEffect(() => {
    setLoading(true);
    
    // Attempt to load updated user data from localStorage first
    const updatedUsers = JSON.parse(localStorage.getItem('updatedUsers') || '{}');
    const userFromLocalStorage = updatedUsers[userId!];
  
    if (userFromLocalStorage) {
      setUser(userFromLocalStorage);
      setLoading(false);
    } else {
      // Fallback to fetching user data from the API if not found in localStorage
      fetch(`https://dummyjson.com/users/${userId}`)
        .then(response => response.json())
        .then(data => {
          setUser(data);
          setLoading(false);
        })
        .catch(error => {
          setError('Failed to fetch user. Please try again later.');
          setLoading(false);
          return console.error(error);
        });
    }
  }, [userId]);
  


  // Old function to update user data based on API docs

  // function handleUpdateUser() {
  //   if (user) {
  //     const updateUserUrl = `https://dummyjson.com/users/${user.id}`;

  //     // Define the updated user data
  //     const updatedUserData = {
  //       firstName: user.firstName,
  //       lastName: user.lastName,
  //       email: user.email
  //     };

  //     fetch(updateUserUrl, {
  //       method: 'PUT', // or PATCH
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(updatedUserData)
  //     })
  //     .then(res => res.json())
  //     .then(updatedUser => {
  //       console.log('User updated successfully:', updatedUser);
  //     })
  //     .catch(error => {
  //       console.error('Failed to update user:', error);
  //     });
  //     setIsConfirmationModalOpen(true);
  //   }
  // }

  function handleUpdateUser() {
    setCurrentAction('update'); // Set the action to 'update'
    setIsConfirmationModalOpen(true);
  }

  // this function is called when the user confirms the update in the ConfirmationModal
  const confirmedUpdateUser = () => {
    if (user) {
      // Simulate the update by storing the updated user details in localStorage
      const updatedUsers = JSON.parse(localStorage.getItem('updatedUsers') || '{}');
      updatedUsers[user.id] = { ...user };
      localStorage.setItem('updatedUsers', JSON.stringify(updatedUsers));
  
      setIsConfirmationModalOpen(false); // Close the confirmation modal
      navigate('/'); // Adjust the path as needed for your routing
    }
  };

  const handleDeleteUser = () => {
    setCurrentAction('delete'); // Set the action to 'delete'
    setIsConfirmationModalOpen(true);
  };

  const confirmedDeleteUser = () => {
    if (user) {
      const deleteUserUrl = `https://dummyjson.com/users/${user.id}`;
      fetch(deleteUserUrl, {
        method: 'DELETE',
      })
      .then(response => {
        if (response.ok) {
          const deletedUserIds = JSON.parse(localStorage.getItem('deletedUserIds') || '[]');
          deletedUserIds.push(user.id);
          localStorage.setItem('deletedUserIds', JSON.stringify(deletedUserIds));
          navigate('/');
        } else {
          throw new Error('Failed to delete user');
        }
      })
      .catch(error => console.error('Failed to delete user:', error));
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="flex justify-center items-center pt-[64px] h-screen">
      <div className="user-card">
        {user && (
          <div className="p-10 max-w-sm bg-slate-300 rounded-lg overflow-hidden shadow-lg text-center dark:bg-gray-700">
            <div className="flex items-center justify-center">
              <div className={`w-40 h-40 overflow-hidden ${user.gender === 'male' ? 'bg-blue-300' : 'bg-pink-300'}`}>
                <img className="w-full h-full object-cover" src={user.image} alt="User" />
              </div>
            </div>
            <form className="px-6 py-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="First Name"
                  value={user.firstName}
                  onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Last Name"
                  value={user.lastName}
                  onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="age">
                  Age
                </label>
                <input
                  id="age"
                  type="number"
                  placeholder="Age"
                  value={user.age}
                  onChange={(e) => setUser({ ...user, age: parseInt(e.target.value) })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gender">
                  Gender
                </label>
                <input
                  id="gender"
                  type="gender"
                  placeholder="Gender"
                  value={user.gender}
                  onChange={(e) => setUser({ ...user, gender: e.target.value })}
                />
              </div>
              </form>
            <div className="flex justify-center">
              <button className="btn" onClick={handleUpdateUser}>Update Cat</button>
              <button className="btn btn-cancel" onClick={handleDeleteUser}>Delete Cat</button>
            </div>
          </div>
        )}
      </div>
      <ConfirmationModal 
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={currentAction === 'update' ? confirmedUpdateUser : confirmedDeleteUser}
        message={
          currentAction === 'update'
            ? "Are you sure you want to update this cat?"
            : "Are you sure you want to delete this cat?"
        }
      />
    </div>
  );
}
