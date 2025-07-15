import React,{FC,useEffect, useState,ChangeEvent,FormEvent} from "react";
import { useAppSelector,useAppDispatch } from "../app/hooks";
import { fetchTodos,addTodo,updateTodo,deleteTodo } from "../features/todo/todoSlice";
import { Container,Typography,Box,TextField,Button,List,ListItem,ListItemText,Checkbox,IconButton,Grid} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Todo } from '../types/index';

//フォームの入力用の型を定義する
interface NewTodoState{
  title:string;
  description:string;
  dueDate:string;
  priority:"高"|"低";
}

const HomePage:FC=()=>{
  const dispatch=useAppDispatch();
  //Reduxストアからtodosスライスの状態を取得する

  //編集中のタスクを管理するためのstateの定義を行う
  const [editingTodoId,setEditingTodoId]=useState<string|null>(null);
  const [editedTodoData,setEditedTodoData]=useState({title:"",description:""});

  //stateをオブジェクトで管理するように変更する
  const [newTodo,setNewTodo]=useState<NewTodoState>({
    title:"",
    description:"",
    dueDate:"",
    priority:"低",//デフォルト
  });

  //編集開始の処理
  const handleEditstart=(todo:Todo)=>{
    setEditingTodoId(todo._id);
    setEditedTodoData({title:todo.title,description:todo.description||""});
  };

  //編集内容が変更されたときの処理
  const handleEditChange=(e:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>{
    setEditedTodoData({...editedTodoData,[e.target.name]:e.target.value});
  };

  //保存ボタンが押されたときの処理
  const handleUpdateTodo=(id:string)=>{
    dispatch(updateTodo({id,data:editedTodoData}));
    setEditingTodoId(null);//編集モードの終了
  };

  //認証スライスからユーザー情報も取得
  const {user,status: authStatus}=useAppSelector((state)=>state.auth);
  
  //todoスライスからtodoの情報も取得
  const {todos, status: todoStatus, error}=useAppSelector((state)=>state.todos);
  
  //コンポーネントが最初に表示されたときに一度だけ実行する
  useEffect(()=>{
    //ログインしている場合にtodoを実行する
    if(authStatus==="succeeded"&&user){
      dispatch(fetchTodos());
    }
  },[dispatch,user,authStatus]);//dispatchとuserが変更されたときに再実行


  //イベントオブジェクトに型を付ける
  const handleChange=(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>)=>{
    setNewTodo({
      ...newTodo,
      [e.target.name]:e.target.value,
    });
  };


  //フォーム送信時の処理を追加する
  //イベントオブジェクトに型を付ける
  const handleAddTodo=(e: FormEvent<HTMLFormElement>)=>{
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

  // const handleToggle=(todo: Todo)=>{
  //   dispatch(toggleTodo(todo));
  // };

  //削除ボタンがクリックされたときの処理を追加する
  const handleDelete=(todoId:string)=>{
    if(window.confirm("このタスクを削除しますか？")){
      dispatch(deleteTodo(todoId));
    }
  };
   console.log('現在のTodoオブジェクト:', todos);

   const highPriorityTodos=todos.filter(todo=>todo.priority==="高");
   const lowPriorityTodos=todos.filter(todo=>todo.priority==="低");

  return (

    <Container maxWidth="lg"> {/* 表示エリアを少し広げる */}
  <Box sx={{ my: 4 }}>
    <Typography variant="h4" component="h1" gutterBottom>
      {user ? `${user.name}さんのTodoリスト` : "Todoリスト"}
    </Typography>

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

    {todoStatus === "loading" && <Typography>読み込み中...</Typography>}
    {todoStatus === "failed" && <Typography color="error">エラー: {error}</Typography>}

    {/* Gridレイアウトで優先度別表示 */}
    <Grid container columnSpacing={24} rowSpacing={4} justifyContent="center" sx={{ mt: 2 }}>
  {/* --- 左側のカラム：優先度が高いタスク --- */}
  <Grid item xs={12} md={5}>
    <Typography variant="h5" component="h2" gutterBottom>
      優先度：高
    </Typography>
    {highPriorityTodos.length > 0 ? (
      <List>
        {highPriorityTodos.map((todo) => (
          <ListItem
            key={todo._id}
            divider
            sx={{
              backgroundColor: '#ffebee',
              borderRadius: '8px',
              mb: 1,
            }}
          >
            {editingTodoId === todo._id ? (
              <Box sx={{ width: '100%' }}>
                <TextField
                  name="title"
                  value={editedTodoData.title}
                  onChange={handleEditChange}
                  fullWidth
                  size="small"
                />
                <TextField
                  name="description"
                  value={editedTodoData.description}
                  onChange={handleEditChange}
                  fullWidth
                  multiline
                  size="small"
                  sx={{ mt: 1 }}
                />
                <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    onClick={() => handleUpdateTodo(todo._id)}
                  >
                    保存
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setEditingTodoId(null)}
                  >
                    キャンセル
                  </Button>
                </Box>
              </Box>
            ) : (
              <>
                <ListItemText
                  primary={todo.title}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.primary">
                        優先度: {todo.priority}
                        {todo.dueDate ? ` | 期日: ${new Date(todo.dueDate).toLocaleDateString()}` : ''}
                      </Typography>
                      <br />
                      {todo.description && (
                        <Typography component="span" variant="body2" color="text.secondary">
                          {todo.description}
                        </Typography>
                      )}
                    </>
                  }
                />
                <IconButton onClick={() => handleEditstart(todo)}>
                  <Typography variant="body2">編集</Typography>
                </IconButton>
                <IconButton onClick={() => handleDelete(todo._id)}>
                  <DeleteIcon />
                </IconButton>
              </>
            )}
          </ListItem>
        ))}
      </List>
    ) : (
      <Typography>タスクはありません</Typography>
    )}
  </Grid>

  {/* --- 右側のカラム：優先度が低いタスク --- */}
  <Grid item xs={12} md={5}>
    <Typography variant="h5" component="h2" gutterBottom>
      優先度：低
    </Typography>
    {lowPriorityTodos.length > 0 ? (
      <List>
        {lowPriorityTodos.map((todo) => (
          <ListItem
            key={todo._id}
            divider
            sx={{
              backgroundColor: '#e3f2fd',
              borderRadius: '8px',
              mb: 1,
            }}
          >
            {editingTodoId === todo._id ? (
              <Box sx={{ width: '100%' }}>
                <TextField
                  name="title"
                  value={editedTodoData.title}
                  onChange={handleEditChange}
                  fullWidth
                  size="small"
                />
                <TextField
                  name="description"
                  value={editedTodoData.description}
                  onChange={handleEditChange}
                  fullWidth
                  multiline
                  size="small"
                  sx={{ mt: 1 }}
                />
                <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    onClick={() => handleUpdateTodo(todo._id)}
                  >
                    保存
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setEditingTodoId(null)}
                  >
                    キャンセル
                  </Button>
                </Box>
              </Box>
            ) : (
              <>
                <ListItemText
                  primary={todo.title}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.primary">
                        優先度: {todo.priority}
                        {todo.dueDate ? ` | 期日: ${new Date(todo.dueDate).toLocaleDateString()}` : ''}
                      </Typography>
                      <br />
                      {todo.description && (
                        <Typography component="span" variant="body2" color="text.secondary">
                          {todo.description}
                        </Typography>
                      )}
                    </>
                  }
                />
                <IconButton onClick={() => handleEditstart(todo)}>
                  <Typography variant="body2">編集</Typography>
                </IconButton>
                <IconButton onClick={() => handleDelete(todo._id)}>
                  <DeleteIcon />
                </IconButton>
              </>
            )}
          </ListItem>
        ))}
      </List>
    ) : (
      <Typography>タスクはありません</Typography>
    )}
  </Grid>
</Grid>

  </Box>
</Container>

   
  );
};

export default HomePage;