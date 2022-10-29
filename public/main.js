const socket = io()
const tot = document.getElementById('total')
const cont = document.getElementById('message-cont')
const naem = document.getElementById('client-name')
const inp = document.getElementById('message-input')
const form = document.getElementById('message-form')
const back = document.getElementById('feed')
const aud = new Audio('/bin/Notification.mp3')

form.addEventListener('submit', (e) => {
    e.preventDefault()
    sendMsg()
})

function sendMsg() {
    if(inp.value == '') return
    aud.play()
    console.log(inp.value)
    const data = {
        name: naem.value,
        message: inp.value,
        date: new Date()
    }
    socket.emit('message', data)
    addMsg(true,data)
    inp.value = ''
}


socket.on('clients-total', (data) => {
    console.log(data)
    tot.innerText = `Total Users : ${data}`
    if(sessionStorage.getItem("username")==null) {
        naem.value = `user${data}`
        sessionStorage.setItem("username", data)
    }else naem.value = `user${sessionStorage.getItem("username")}`
})

socket.on('chat', (data) => {
    console.log(data)
    addMsg(false,data)
})


function addMsg(isOwnMsg, data) {
    clearFeed()
    const ele = `
    <li class="${isOwnMsg ? "message-right" : "message-left"}">
    <p class="message">
        ${data.message}
        <span>${data.name}</span>
    </p>
    </li>`

    cont.innerHTML += ele
    scrol()
}

function scrol() {
    cont.scrollTo(0, cont.scrollHeight)
}

inp.addEventListener('keypress', (e) => {
    socket.emit('feedback', {
        feedback: `${naem.value} is typing...`
    })
})


socket.on('feedback', (data) => {
    clearFeed()
    const ele = `
    <li class="feedback">
    <p class="feed" id="feed">
        ${data.feedback}
    </p>
    </li>`
    cont.innerHTML += ele

})

function clearFeed() {
    document.querySelectorAll('li.feedback').forEach(element => {
        element.parentNode.removeChild(element)
    })
}