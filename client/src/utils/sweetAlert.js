import Swal from 'sweetalert2'


const successAlert = (title, text) => {
    return Swal.fire({
        icon: 'success',
        title: title,
        text: text,
        confirmButtonColor: '#2563eb'
    })
}

const errorAlert = (title, text) => {
    return Swal.fire({
        icon: 'error',
        title: title,
        text: text,
        confirmButtonColor: '#2563eb'
    })
}

export { successAlert, errorAlert }