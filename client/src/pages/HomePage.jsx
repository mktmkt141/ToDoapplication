import React,{useEffect, useState} from "react";
import { useSelector,useDispatch } from "react-redux";
import { fetchTodos,addTodo,toggleTodo,deleteTodo } from "../features/todo/todoSlice";
import { Container,Typography,Box,TextField,Button,List,ListItem,ListItemText,Checkbox,IconButton} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const HomePage=()=>{
  const dispatch=useDispatch();
  //Reduxストアからtodosスライスの状態を取得する

  //stateをオブジェクトで管理するように変更する
  const [newTodo,setNewTodo]=useState({
    title:"",
    description:"",
    dueDate:"",
    priority:"低",//デフォルト
  });

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


  const handleChange=(e)=>{
    setNewTodo({
      ...newTodo,
      [e.target.name]:e.target.value,
    });
  };


  //フォーム送信時の処理を追加する
  const handleAddTodo=(e)=>{
    e.preventDefault();
    if(newTodo.title.trim()==="")return;//空の時は何もしない
    dispatch(addTodo(newTodo));
    setNewTodo({
      title:"",
      description:"",
      dueDate:"",
      priority:"低",
    });//送信後、入力欄を空にする
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
   console.log('現在のTodoオブジェクト:', todos);

  return (

    <Container maxWidth="md">
      <Box sx={{my:4}}>
        <Typography variant="h4" component="h1" gutterBottom>
          {user ? user.name+"さんのTodoリスト":"Todoリスト"}
        </Typography> 
        

        {/* タスク追加のフォーム */}
        <Box component="form" onSubmit={handleAddTodo} sx={{display:"flex",gap:1,mb:2}}>
          <TextField name="title" label="タイトル" value={newTodo.title} onChange={handleChange} required variant="outlined" size="small"/>
          <TextField name="description" label="詳細" value={newTodo.description} onChange={handleChange} variant="outlined" size="small"/>
          <TextField name="dueDate" type="date" value={newTodo.dueDate} onChange={handleChange} variant="outlined" size="small" InputLabelProps={{shrink:true}}/>
          <TextField name="priority" label="優先度" value={newTodo.priority} onChange={handleChange} variant="outlined" size="small" select SelectProps={{ native: true }}>
            <option value="低">低</option>
            <option value="高">高</option>
          </TextField>
          <Button type="submit" variant="contained">追加</Button>
        </Box>

        {status==="loading" && <Typography>読み込み中...</Typography>}
        {status==="failed" && <Typography color="error">エラー:{error}</Typography>}
        {status==="loading" && todos.length===0&& <Typography>タスクはありません。</Typography>}

        <List>
          {todos.map((todo) => (
            
            <ListItem 
              key={todo._id} 
              divider
              sx={{ 
                backgroundColor: todo.priority === '高' ? '#ffebee' : '#e3f2fd',
                borderRadius: '8px',
                mb: 1, // 各タスクの下に少しマージンを追加
              }}
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(todo._id)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              {/* <Checkbox
                edge="start"
                checked={todo.completed}
                onChange={() => handleToggle(todo)}
              /> */}
              <ListItemText
                primary={todo.title}
                secondary={<React.Fragment>
                              <Typography component="span" variant="body2" color="text.primary">
                                優先度: {todo.priority} {todo.dueDate ? `| 期日: ${new Date(todo.dueDate).toLocaleDateString()}` : ''}
                              </Typography>
                              <br/>
                              {/* descriptionが存在する場合のみ表示 */}
                              {todo.description &&
                                <Typography component="span" variant="body2" color="text.secondary">
                                  {todo.description}
                                </Typography>
                              }
                            </React.Fragment>}
                sx={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
              />
            </ListItem>
          ))}
        </List>

      </Box>
    </Container>
    // <div>
    //   <h2>{user ? `${user.name}さんのTodoリスト`:"Todoリスト"}</h2>
    //   <form onSubmit={handleAddTodo}>
    //     <div>
    //       <label>タイトル:</label>
    //       <input 
    //         type="text"
    //         name="title"
    //         value={newTodo.title}
    //         onChange={handleChange}
    //         placeholder="新しいタスクのタイトル"
    //         required
    //        />
    //     </div>

    //     <div>
    //       <label>詳細:</label>
    //       <textarea 
    //         name="description"
    //         value={newTodo.description}
    //         onChange={handleChange}
    //         placeholder="タスクの詳細"
           
    //        />
    //     </div>

    //     <div>
    //       <label>期日:</label>
    //       <input 
    //         type="date"
    //         name="dueDate"
    //         value={newTodo.dueDate}
    //         onChange={handleChange}
    //        />
    //     </div>

    //     <div>
    //       <label>優先度:</label>
    //       <select
    //         name="priority"
    //         value={newTodo.priority}
    //         onChange={handleChange}>
    //         <option value="低">低</option>
    //         <option value="高">高</option>
    //        </select>
    //     </div>
    //     <button type="submit">追加</button>
        
    //   </form>
      
    //   {/* {ローディング中ならスピナーを表示する} */}
    //   {todoStatus==="loading"&&<p>読み込み中...</p>}
    //   {/* {エラーが発生したときにエラーメッセージを表示する} */}
    //   {todoStatus==="failed"&&<p>エラー...:{error}</p>}
    //   {/* {ローディング中ならエラーでもなくtodoの数が0個なら「タスクがありません」と表示} */}
    //   {todoStatus!=="loading"&&todoStatus!=="failed"&&todos.length===0&&(
    //     <p>タスクがまだありません。新しいタスクを追加しましょう！！</p>
    //   )}
      
    //   {todos.length>0&&(
    //     <ul>
    //       {todos.map((todo)=>(
    //         <li key={todo._id} style={{border:"1px solid #ccc",margin:"10px",padding:"10px"}}>
    //           {/* <input 
    //             type="checkbox"
    //             checked={todo.completed}
    //             onChange={()=>handleToggle(todo)}
    //            /> */}
    //            <span style={{
    //             textDecoration:todo.completed ? "line-through" : "none",
    //             fontWeight:"bold",
    //             fontSize:"1.2em",
    //            }}>
    //             {todo.title}
    //            </span>
    //            <p>優先度:{todo.priority}</p>

    //            {/* descriptionがある場合のみ表示する */}
    //            {todo.description&&<p>詳細:{todo.description}</p>}

    //            {/* dueDateが存在するときのみ見やすい形式で表示する */}
    //            {todo.dueDate&&(
    //             <p>期日:{new Date(todo.dueDate).toLocaleDateString()}</p>
    //            )}

    //            <button onClick={()=>handleDelete(todo._id)}>削除</button>
              
    //         </li>
    //       ))}
    //     </ul>
    //   )}
    // </div>
  );
};

export default HomePage;