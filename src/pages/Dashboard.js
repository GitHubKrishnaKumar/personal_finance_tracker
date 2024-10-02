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
import TransactionsTable from '../components/TransactionsTable';
import ChartComponent from '../components/Charts';
import NoTransaction from '../components/NoTransaction';

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

  const [income,setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

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
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    addTransaction(newTransaction);
  }

   async function addTransaction(transaction, many){
    try {
      const docRef = await addDoc(
        collection(db,`users/${user.uid}/transactions`), transaction);
     
      console.log("Document written with Id: ",docRef.id);
      if(!many) toast.success("Transaction Added!");
      // update transaction
      let newArray = transactions;
      newArray.push(transaction);
      setTransactions(newArray);
      calculateBalance();
    } catch (e) {
      console.log("Error adding document",e);
      if(!many) toast.error("couldn't add transaction");
    }
  }
  useEffect(() => {
    // get all doc from a collection
    fetchTransactions();
  }, [user]);

  useEffect(() => {
    calculateBalance();
  }, [transactions]);

  const calculateBalance = () => {
    let incomeTotal = 0;
    let expensesTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expensesTotal += transaction.amount;
      }
    });

    setIncome(incomeTotal);
    setExpense(expensesTotal);
    setTotalBalance(incomeTotal - expensesTotal);
  };


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
  //for chart
  let sortedTransaction = transactions.sort((a,b) =>{
    return new Date(a.date) - new Date(b.date)
  })
  return (
    <div>
      <Header />
      {loading ? 
        (<p>Loading.....</p>) 
        : 
        (<>
        <Cards 
          income={income}
          expense={expense}
          totalBalance = {totalBalance}

          showExpenseModal = {showExpenseModal}
          showIncomeModal ={showIncomeModal}
        />
        {/* chart page add */}
        {transactions && transactions.length != 0 ? <ChartComponent sortedTransaction={sortedTransaction}/> :<NoTransaction/>}
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
        <TransactionsTable 
          transactions = {transactions}
          addTransaction={ addTransaction} 
          fetchTransactions = {fetchTransactions}
        />
        </>)}
    </div>
  );
}

export default Dashboard