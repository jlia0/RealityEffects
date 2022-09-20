const socket = io()

console.log(socket)

socket.on('add', (data) => {
    console.log(data)
    const label = document.getElementById('dumbbell')
    label.innerText = data;
    label.style.backgroundColor = '#ffffff';
})