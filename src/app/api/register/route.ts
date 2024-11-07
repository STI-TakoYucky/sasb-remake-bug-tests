// import User from "../../../../models/User";
// import connect from "../../../../lib/mongodb";
// import { NextResponse } from "next/server";

// let isConnected = false;

// export const POST = async (request: any, response: any) => {
//     console.time("START API");

//     // Connect only if not connected yet (avoid reconnecting every time)
//     if (!isConnected) {
//         await connect();
//         isConnected = true;
//     }

//     // Parse request body
//     const { firstName, lastName, email, password } = await request.json();

//     try {
       
//         // Create new user if not already existing.
//         const newUser = new User({
//             firstName,
//             lastName,
//             email,
//             password,
//         });
//         await newUser.save();

//         console.timeEnd("START API");
//         return NextResponse.json({ message: "Registered successfully" }, { status: 201 });

//     } catch (error) {
//         console.error("Error during registration:", error);
//         console.timeEnd("START API");

//         if(response.status == 409) {
//             return NextResponse.json({ message: "Email already exists" }, { status: 409 });
//         }
//         return NextResponse.json({ message: "Internal server error" }, { status: 500 });
//     }
// };

import User from "../../../../models/User";
import connect from "../../../../lib/mongodb";
import { NextResponse } from "next/server";

let isConnected = false;

export const POST = async (request: any, response: any) => {
    console.time("START API");

    try {
        // Profile database connection time
        console.time("Database Connection");
        if (!isConnected) {
            await connect();
            isConnected = true;
        }
        console.timeEnd("Database Connection");

        // Profile request parsing time
        console.time("Parsing Request Body");
        const { firstName, lastName, email, password } = await request.json();
        console.timeEnd("Parsing Request Body");

        // Check if user already exists
        console.time("Check if Email Exists");
        const emailAlreadyExists = await User.findOne({ email });
        console.timeEnd("Check if Email Exists");

        if (emailAlreadyExists) {
            console.timeEnd("START API");
            return NextResponse.json({ message: "Email already exists" }, { status: 409 });
        }

        // Profile user creation process
        console.time("User Creation");
        const newUser = new User({
            firstName,
            lastName,
            email,
            password,
        });
        await newUser.save();
        console.timeEnd("User Creation");

        console.timeEnd("START API");
        return NextResponse.json({ message: "Registered successfully" }, { status: 201 });

    } catch (error) {
        console.error("Error during registration:", error);

        // End API timing upon error
        console.timeEnd("START API");

        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
};


