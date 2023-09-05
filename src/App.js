import React, {useState, useEffect } from 'react';
import List from './List';
import Alert from './Alert';
const getLocalStorage = () => {
  let list = localStorage.getItem('list');
  if (list) {
    return (list = JSON.parse(localStorage.getItem('list')))
  } else {
    return [];
  }
}

function App() {
  const [name, setName] = useState('');
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  const [alert, setAlert] = useState({show: '', msg:'', type: ''})

  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      showAlert(true, 'danger', 'please enter value')
    } else if (name && isEditing) {
      const newItems = list.map((item) => {
        if (item.id === editID) {
          item.title = name
          return item
        }
        return item
      })
      setList(newItems);
      setEditID('');
      setName('');
      setIsEditing(false);
      showAlert(true, "danger", "item updated");
    } else {
      const newItem = {id: new Date().getTime().toString(), title: name};
      setList([...list, newItem]);
      showAlert(true, 'success', 'item added to the list')
      setName('');
    }
  }

  const showAlert = (show = false, type = '', msg = '' ) => {
    setAlert({show, type, msg});
  }

  const removeItem = (id) => {
    const sortedItem = list.filter((item) => item.id !== id )
    setList(sortedItem);
    showAlert(true, 'danger', 'item removed')
  }
  const editItem = (id) => {
    const selectedItem = list.find((item) => item.id === id);
    setEditID(selectedItem.id); 
    setName(selectedItem.title);
    setIsEditing(true);
  }

  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(list));
  },[list])

  return (
    <section className="section-center">
      <form className="grocery-form"
        onSubmit={handleSubmit}
      >
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
        <h3>grocery bud</h3>
        <div className="form-control">
          <input 
            type="text" 
            className="grocery" 
            value={name}
            placeholder='e.g. eggs'
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" className="submit-btn">
            {isEditing ? 'edit' : 'submit'}
          </button>
        </div>
      </form>
      <div className="grocery-container">
        <List 
          items={list} 
          removeItem={removeItem} 
          editItem={editItem}
        />
      </div>
    </section>
  )
}

export default App