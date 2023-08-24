import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import UserList from "./pages/user/UserList"; 
import 'react-toastify/dist/ReactToastify.css';
import CustomNavbar from "./components/CustomNavbar";
import { useState } from "react";
import { API_URL } from "./api";

const client = new ApolloClient({
  uri: (API_URL),
  cache: new InMemoryCache(),
});

function App() {
  const [dataFromChild, setDataFromChild] = useState("");
  const handleDataFromChild = (childData) => {
    setDataFromChild(childData);
  };
  return (
    <ApolloProvider client={client}>
      <CustomNavbar handleSearch={handleDataFromChild} />
      <UserList search={dataFromChild} />
    </ApolloProvider>
  );
}

export default App;
