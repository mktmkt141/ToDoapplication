import React,{useEffect, useState} from "react";
import { useSelector,useDispatch } from "react-redux";
import { fetchTodos,addTodo,toggleTodo,deleteTodo } from "../features/todo/todoSlice";

const HomePage=()=>{
  const dispatch=useDispatch();
  //Reduxストアからtodosスライスの状態を取得する
  const [newTodoTitle,setNewTodoTitle]=useState("");

  //認証スライスからユーザー情報も取得
  const {user,status: authStatus}=useSelector((state)=>state.auth);
  
  //todoスライスからtodoの情報も取得
  const {todos, status: todoStatus, error}=useSelector((state)=>state.todos);
  
  //コンポーネントが最初に表示されたときに一度だけ実行する
  useEffect(()=>{
    //ログインしている場合にtodoを実行する
    if(authStatus==="succeeded"&&user){
      dispatch(fetchTodos());
    }
  },[dispatch,user,authStatus]);//dispatchとuserが変更されたときに再実行


  //フォーム送信時の処理を追加する
  const handleAddTodo=(e)=>{
    e.preventDefault();
    if(newTodoTitle.trim()==="")return;//空の時は何もしない
    dispatch(addTodo({title:newTodoTitle}));
    setNewTodoTitle("");//送信後、入力欄を空にする
  };
  //チェックボックスがクリックされたときの処理を追加
  const handleToggle=(todo)=>{
    dispatch(toggleTodo(todo));
  };

  //削除ボタンがクリックされたときの処理を追加する
  const handleDelete=(todoId)=>{
    if(window.confirm("このタスクを削除しますか？")){
      dispatch(deleteTodo(todoId));
    }
  };

  return (
    <div>
      <h2>{user ? `${user.name}さんのTodoリスト`:"Todoリスト"}</h2>

      <form onSubmit={handleAddTodo}>
        <input type="text" value={newTodoTitle} onChange={(e)=>setNewTodoTitle(e.target.value)} placeholder="新しいタスクを追加"></input>
        <button type="submit">追加</button>
      </form>
      
      {/* {ローディング中ならスピナーを表示する} */}
      {todoStatus==="loading"&&<p>読み込み中...</p>}
      {/* {エラーが発生したときにエラーメッセージを表示する} */}
      {todoStatus==="failed"&&<p>エラー...:{error}</p>}
      {/* {ローディング中ならエラーでもなくtodoの数が0個なら「タスクがありません」と表示} */}
      {todoStatus!=="loading"&&todoStatus!=="failed"&&todos.length===0&&(
        <p>タスクがまだありません。新しいタスクを追加しましょう！！</p>
      )}
      
      {todos.length>0&&(
        <ul>
          {todos.map((todo)=>(
            <li key={todo._id}>
              {/* <input 
                type="checkbox"
                checked={todo.completed}
                onChange={()=>handleToggle(todo)}
               /> */}
               <span style={{textDecoration:todo.completed ? "line-through" : "none"}}>
                {todo.title}
               </span>

               <button onClick={()=>handleDelete(todo._id)}>削除</button>
              
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HomePage;