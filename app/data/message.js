import tutor from "./tutor";

const message = [
    {
        _id: 1,
        createdAt: new Date(2023,8,15,10,30),
        text: "Hi Anna",
        user: {
            _id: "001",
        }
    },
    {
        _id: 2,
        createdAt: new Date(2023,8,15,10,31),
        text: "Can I please have some help with algebra and calculus?",
        user: {
            _id: "001",
        }
    },
    {
        _id: 3,
        createdAt: new Date(2023,8,15,10,35),
        text: "Sure!",
        user: {
            _id: "002",
            avatar: tutor[0].profile_pic
        }
    },
    {
        _id: 4,
        createdAt: new Date(2023,8,15,10,36),
        text: "When can we meet?",
        user: {
            _id: "001",
        }
    },
]

export default message