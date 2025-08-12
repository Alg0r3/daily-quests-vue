import axios from 'axios'

export async function get(url) {
    const response = await axios.get(url)
    return response.data
}
