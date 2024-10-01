import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Cards from '../components/Cards'
import { Modal } from 'antd';
import AddExpenseModal from '../components/Modals/addExpense';
import AddIncomeModal from '../components/Modals/addIncome';
import { auth, db } from '../firebase';
import {addDoc , collection, query, getDocs} from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useAuthState } from 'react-firebase-hooks/auth';
import moment from 'moment'; //it's a moment package (npm i moment)

function Dashboard() {
  // data add in doc in firebase this type
  // const transactions = [
  //   {
  //     type : "income",
  //     amount: 1230,
  //     date: "2024-10-02",
  //     name: "Krishna Kumar",
  //     tag: "freelance",
      
  //   },
  //   {
  //     type : "expense",
  //     amount:1200,
  //     date:"2024-10-02",
  //     name: "expense-1",
  //     tag: "food"
  //   }
  // ];
  const [loading,setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [user] = useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [ isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);

  const showExpenseModal = () =>{
    setIsExpenseModalVisible(true);
  }
  const showIncomeModal = () =>{
    setIsIncomeModalVisible(true);
  }
  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  }
  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  }
  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: moment(values.date).format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    addTransaction(newTransaction);
  }

   async function addTransaction(transaction){
    try {
      const docRef = await addDoc(
        collection(db,`users/${user.uid}/transactions`), transaction
      );
      console.log("Document written with Id: ",docRef.id);
      toast.success("Transaction Added!");
    } catch (e) {
      console.log("Error adding document",e);
      toast.error("couldn't add transaction");
    }
  }
  useEffect(() => {
    // get all doc from a collection
    fetchTransactions();
  }, []);
// fetch data function
  async function fetchTransactions(){
    setLoading(true);
    if(user){
      const q = query(collection(db,`users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
        //doc.data() is never undefined for query doc snapshots
        transactionsArray.push(doc.data());
      });
      setTransactions(transactionsArray);
      console.log("Transaction fethed", transactionsArray);
      toast.success("Transaction Fetched!");
    }
    setLoading(false);
  }
  
  return (
    <div>
      <Header />
      {loading ? 
        (<p>Loading.....</p>) 
        : 
        (<>
        <Cards 
          showExpenseModal = {showExpenseModal}
          showIncomeModal ={showIncomeModal}
        />

        <AddIncomeModal
          isIncomeModalVisible = {isIncomeModalVisible}
          handleIncomeCancel = {handleIncomeCancel}
          onFinish={onFinish}
        />
        <AddExpenseModal 
          isExpenseModalVisible = {isExpenseModalVisible}
          handleExpenseCancel = {handleExpenseCancel}
          onFinish={onFinish}
        />
        </>)}
    </div>
  );
}

export default Dashboard