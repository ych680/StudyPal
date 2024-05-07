import anna from "../assets/avatars/woman.png"
import phyllis from "../assets/avatars/man.png"
import judith from "../assets/avatars/woman1.png"
import freddie from "../assets/avatars/man4.png"

const tutor = [
    {
        id: 1,
        name: "Anna Smith",
        profile_pic: anna,
        user_id: "002",
        qualification: "Bachelor of Science, Math and Statistics, Stage 3",
        gpa: 7.5,
        rating: 5,
        tutor_for: ["Stage 1", "Stage 2"],
        language: ["English", "Spanish"],
        tags: ["Algebra", "Calculus", "Probability", "Statistical Modelling"],
        description: "Hey guys, I’m Anna! I’m currently studying Mathematics and Statistics in the University of Auckland. I have done courses like MATH108 / MATH208 and STAT10X / STATS20X. If you have any questions on assignments, tests, or exams, come and ask me!"
    },
    {
        id: 2,
        name: "Phyllis Johnson",
        profile_pic: phyllis,
        user_id: "003",
        qualification: "Bachelor of Science, Computer Science, Stage 3",
        gpa: 7.3,
        rating: 5,
        tutor_for: ["Stage 1", "Stage 2"],
        language: ["English", "German", "Maori"],
        tags: ["Python", "Data Structures and Algorithms", "Java", "JavaScript"]
    },
    {
        id: 3,
        name: "Judith Parrish",
        profile_pic: judith,
        user_id: "004",
        qualification: "Stage 3 Accounting student in UoA",
        gpa: 8.2,
        rating: 4.2,
        tutor_for: ["Stage 1", "Stage 2"],
        language: ["English", "Mandarin", "Japanese, Korean, German, Cantonese, French"],
        tags: ["Accounting", "Guitar"]
    },
    {
        id: 4,
        name: "Freddie Mata",
        profile_pic: freddie,
        user_id: "005",
        qualification: "Bachelor of Science, Computer Science, Stage 2",
        rating: 0,
        tutor_for: ["Stage 1"],
        language: ["English"],
        tags: ["Python"]
    },
]

export default tutor