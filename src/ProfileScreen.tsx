import './ProfileScreen.css';

export default function ProfileScreen() {
  return (
    <div className="profile-screen">
      <div className="profile-container">
        <div className="profile-header">
          <img
            className="profile-photo"
            src="https://randomuser.me/api/portraits/men/1.jpg"
            alt="Emil's profile"
          />
        </div>
        <div className="profile-body" style={{ textAlign: 'center', padding: '24px' }}>
          <h2 style={{ margin: 0 }}>Emil</h2>
        </div>
      </div>
    </div>
  );
}