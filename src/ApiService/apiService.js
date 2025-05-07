const API_BASE_URL = 'http://cci-ci-test.charlotte.edu:8000';

export const signup = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if(!response.ok){
        const { message } = await response.json();
        throw new Error(message);
    }

    return response.json();
}

export const login = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
    });

    if(!response.ok){
        const { message } = await response.json();
        throw new Error(message);
    }

    return response.json();
}

export const logout = async () => {
    const response = await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    if(!response.ok){
        const { message } = await response.json();
        throw new Error(message);
    }

    return response.json();
}

export const getCourses = async () => {
    const response = await fetch (`${API_BASE_URL}/courseAccess`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    if(!response.ok){
        const { message } = await response.json();
        throw new Error(message);
    }
    
    return response.json();
}

export const getCourseData = async (courseNameSection) => {
    console.log('CourseNameSection:', courseNameSection);
    console.log('fetching data');
    const response = await fetch(`${API_BASE_URL}/courseData?courseNameSection=${courseNameSection}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        //body: JSON.stringify({ courseNameSection }),
    });

    if(!response.ok){
        const { message } = await response.json();
        throw new Error(message);
    }

    return response.json();
}