fetch('/userInfo', {
  method: 'GET', // *GET, POST, PUT, DELETE, etc.
}) // body data type must match "Content-Type" header)
.then(response => response.json())
.then(data => {
  document.getElementById("list-username").innerHTML = data.user;
})

const listDiv = document.getElementById("list-list");

function createTasks(tasks) {
  for (var i = 0; i < tasks.length; i++){
    const item = document.createElement("div")
    item.className = "list-item"
    const checkbox = document.createElement("input");
    const iString = i.toString()
    checkbox.setAttribute('type', 'checkbox');
    checkbox.setAttribute('id', 'checkbox'+iString);
    const label = document.createElement("label");
    label.setAttribute('for', 'checkbox'+iString);
    label.setAttribute('data-taskId', tasks[i]._id);
    const span = document.createElement("span");
    const del = document.createElement("a");
    del.innerText = "delete";
    del.className = "delete";

    del.addEventListener("click", function() {
      const id = this.parentElement.getElementsByTagName('label')[0].getAttribute('data-taskId');
      fetch('/edit/'+id, {
        method: 'DELETE' // *GET, POST, PUT, DELETE, etc.
      }).then(

      this.parentElement.remove()
      )
    });

    if (tasks[i].done) {
      checkbox.checked = true;
    } else {
      checkbox.checked = false;
    }
    span.innerText = tasks[i].text;

    label.appendChild(span)
    item.appendChild(checkbox)
    item.appendChild(label)
    item.appendChild(del)

    item.addEventListener("click", function(){
      if (event.target.tagName === 'LABEL'){
        return;
      }

      const id = this.getElementsByTagName('label')[0].getAttribute('data-taskId');
      sendPut(id);
    })

    listDiv.appendChild(item)
  }
}

fetch('/tasks', {
  method: 'GET' // *GET, POST, PUT, DELETE, etc.
}) // body data type must match "Content-Type" header)
.then(response => response.json())
.then(data => {
  createTasks(data);
})


// when checkbox clicked, send put request
function sendPut(id){
  fetch('/edit/'+id, {
    method: 'PUT' // *GET, POST, PUT, DELETE, etc.
  }) // body data type must match "Content-Type" header)

}

console.log('script running')
