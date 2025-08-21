export const getTags = () => {
    return fetch('http://localhost:5000/tags').then(res => res.json())
}

export const getTagById = (id) => {
    return fetch(`http://localhost:5000/tags/${id}`).then(res => res.json())
}

export const createTag = (tagData) => {
    return fetch('http://localhost:5000/tags', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(tagData)
    }).then(res => res.json())
}

export const updateTag = (id, tagData) => {
    return fetch(`http://localhost:5000/tags/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(tagData)
    }).then(res => res.json())
}

export const deleteTag = (id) => {
    return fetch(`http://localhost:5000/tags/${id}`, {
        method: 'DELETE'
    }).then(res => res.json())
}