import React, { FC, useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { fetchTodos, addTodo, updateTodo, deleteTodo } from "../features/todo/todoSlice";
import { Container, Typography, Box, TextField, Button, List, ListItem, ListItemText, Checkbox, IconButton, Grid, MenuItem } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { Todo } from "../types";

// 入力用の型
interface NewTodoState {
  title: string;
  description: string;
  dueDate: string;
  priority: "高" | "低";
}

const HomePage: FC = () => {
  const dispatch = useAppDispatch();
  const { user, status: authStatus } = useAppSelector((state) => state.auth);
  const { todos, status: todoStatus, error } = useAppSelector((state) => state.todos);

  const [newTodo, setNewTodo] = useState<NewTodoState>({
    title: "",
    description: "",
    dueDate: "",
    priority: "低",
  });

  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [editedTodoData, setEditedTodoData] = useState<Partial<Todo>>({});

  useEffect(() => {
    if (authStatus === "succeeded" && user) {
      dispatch(fetchTodos());
    }
  }, [dispatch, user, authStatus]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setNewTodo({ ...newTodo, [e.target.name]: e.target.value });
  };

  const handleAddTodo = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newTodo.title.trim() === "") return;
    dispatch(addTodo(newTodo));
    setNewTodo({ title: "", description: "", dueDate: "", priority: "低" });
  };

  const handleDelete = (todoId: string) => {
    if (window.confirm("このタスクを削除しますか？")) {
      dispatch(deleteTodo(todoId));
    }
  };

  const handleEditStart = (todo: Todo) => {
    setEditingTodoId(todo._id);
    setEditedTodoData({ ...todo });
  };

  const handleEditChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setEditedTodoData({ ...editedTodoData, [e.target.name]: e.target.value });
  };

  const handleUpdateTodo = () => {
    if (editingTodoId && editedTodoData) {
      dispatch(updateTodo({ id: editingTodoId, data: editedTodoData }));
      setEditingTodoId(null);
    }
  };

  const handleToggleCompleted = (todo: Todo) => {
    dispatch(updateTodo({ id: todo._id, data: { completed: !todo.completed } }));
  };

  const renderTodoList = (todoList: Todo[], color: string) => (
    <List>
      {todoList.map((todo) => (
        <ListItem key={todo._id} divider sx={{ backgroundColor: color, borderRadius: 1, mb: 1 }}>
          {editingTodoId === todo._id ? (
            <Box sx={{ width: '100%' }}>
              <TextField name="title" label="タイトル" value={editedTodoData.title || ''} onChange={handleEditChange} fullWidth size="small" sx={{ mb: 1 }} />
              <TextField name="description" label="詳細" value={editedTodoData.description || ''} onChange={handleEditChange} fullWidth multiline size="small" sx={{ mb: 1 }} />
              <TextField name="dueDate" type="date" value={editedTodoData.dueDate || ''} onChange={handleEditChange} fullWidth size="small" InputLabelProps={{ shrink: true }} sx={{ mb: 1 }} />
              <TextField name="priority" select label="優先度" value={editedTodoData.priority || '低'} onChange={handleEditChange} fullWidth size="small">
                <MenuItem value="高">高</MenuItem>
                <MenuItem value="低">低</MenuItem>
              </TextField>
              <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                <Button variant="contained" startIcon={<SaveIcon />} onClick={handleUpdateTodo}>保存</Button>
                <Button variant="outlined" startIcon={<CancelIcon />} onClick={() => setEditingTodoId(null)}>キャンセル</Button>
              </Box>
            </Box>
          ) : (
            <>
              {/* <Checkbox checked={todo.completed} onChange={() => handleToggleCompleted(todo)} /> */}
              <ListItemText
                primary={todo.title}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                      優先度: {todo.priority} | 期日: {todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : "なし"}
                    </Typography>
                    <br />
                    {todo.description}
                  </>
                }
                sx={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
              />
              <IconButton onClick={() => handleEditStart(todo)}><EditIcon /></IconButton>
              <IconButton onClick={() => handleDelete(todo._id)}><DeleteIcon /></IconButton>
            </>
          )}
        </ListItem>
      ))}
    </List>
  );

  const highPriorityTodos = todos.filter((todo) => todo.priority === "高");
  const lowPriorityTodos = todos.filter((todo) => todo.priority === "低");

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {user ? `${user.name}さんのTodoリスト` : "Todoリスト"}
        </Typography>

        <Box component="form" onSubmit={handleAddTodo} sx={{ display: "flex", gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <TextField name="title" label="タイトル" value={newTodo.title} onChange={handleChange} required variant="outlined" size="small" />
          <TextField name="description" label="詳細" value={newTodo.description} onChange={handleChange} variant="outlined" size="small" />
          <TextField name="dueDate" type="date" value={newTodo.dueDate} onChange={handleChange} variant="outlined" size="small" InputLabelProps={{ shrink: true }} />
          <TextField name="priority" select label="優先度" value={newTodo.priority} onChange={handleChange} variant="outlined" size="small">
            <MenuItem value="低">低</MenuItem>
            <MenuItem value="高">高</MenuItem>
          </TextField>
          <Button type="submit" variant="contained">追加</Button>
        </Box>

        {todoStatus === "loading" && <Typography>読み込み中...</Typography>}
        {todoStatus === "failed" && <Typography color="error">エラー: {error}</Typography>}

        <Grid container columnSpacing={18} rowSpacing={4} justifyContent="center" sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>優先度：高</Typography>
            {highPriorityTodos.length > 0 ? renderTodoList(highPriorityTodos, "#ffebee") : <Typography>タスクはありません</Typography>}
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>優先度：低</Typography>
            {lowPriorityTodos.length > 0 ? renderTodoList(lowPriorityTodos, "#e3f2fd") : <Typography>タスクはありません</Typography>}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default HomePage;
