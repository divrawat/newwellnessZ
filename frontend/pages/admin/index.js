import Admin from '../../components/auth/Admin';
// import dynamic from "next/dynamic";
import AdminDashLayout from "../../components/AdminDashLayout"

const AdminIndex = () => {

  return (

    
    <Admin>
        <AdminDashLayout>
          <h2 style={{color:"var(--text-color)", paddingTop:"7px"}}>Welcome To Admin's DashBoard</h2>
          <div style={{color:"var(--text-color)", paddingTop:"10px"}}>You can now create posts, categories, update or delete anyone's posts in this section</div>
          </AdminDashLayout>  
    </Admin>

  );
};

 export default AdminIndex;
//  export default dynamic(() => Promise.resolve(AdminIndex), { ssr: false })
