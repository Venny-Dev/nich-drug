import UsersContainer from "../components/Users/UsersContainer";
import UsersHeader from "../components/Users/UsersHeader";

function Users() {
  return (
    <div className="p-6">
      <UsersHeader />
      <UsersContainer />
    </div>
  );
}

export default Users;
