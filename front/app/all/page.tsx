'use client'
import { Button, ButtonGroup, Card, CardHeader, CardBody, CardFooter, Divider, Image } from "@nextui-org/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { User } from "@/interfaces/User";

export default function All() {
    const [users, SetUsers] = useState<User[]>();

    async function GetAllUsers() {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/all`, {
            method: 'GET',
            headers: {
                'Access-Control-Allow-Credentials': "true",
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,DELETE,PATCH,POST,PUT',
                'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store',
              },
        });

        return await response.json();
    }

    useEffect(() => {
        document.title = "Хэрэглэгчдийн жагсаалт";

        GetAllUsers()
            .then((response) => {
                if (response && response.length > 0)
                    SetUsers(response as User[]);
            });
    }, []);

    return (
        <div className="min-h-screen">
            <div className="flex justify-center p-8">
                <ButtonGroup>
                    <Button
                        href='/'
                        as={Link}
                        color="default"
                        variant="shadow"
                        className="font-extrabold">
                        Хэрэглэгч үүсгэх
                    </Button>

                    <Button
                        href='/all'
                        as={Link}
                        color="default"
                        variant="shadow"
                        className="font-extrabold">
                        Жагсаалт
                    </Button>
                </ButtonGroup>
            </div>

            <div className="flex flex-col items-center">
                <div className="items-stretch space-y-12">
                    <div className="flex flex-col space-y-2">
                        {users && users.length > 0 && (
                            users.map((usersData, index) => (
                                <Card key={index}>
                                    <CardHeader className="flex gap-3">
                                        {usersData["userImage"] ?
                                            <Image
                                                width={180}
                                                alt="userImage"
                                                src={`data:image/jpeg;base64,${Buffer.from(usersData["userImage"]).toString('base64')}`}
                                            /> :
                                            <Image
                                                width={180}
                                                alt="userImage"
                                                radius="sm"
                                                src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                                            />}
                                        {usersData["ciImage"] ?
                                            <Image
                                                width={180}
                                                alt="ciImage"
                                                radius="sm"
                                                src={`data:image/jpeg;base64,${Buffer.from(usersData["ciImage"]).toString('base64')}`}
                                            /> :
                                            <Image
                                                width={180}
                                                alt="ciImage"
                                                radius="sm"
                                                src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                                            />}
                                    </CardHeader>
                                    <Divider />
                                    <CardBody>
                                        <p>Регистрийн дугаар: {usersData["registrationNumberReq"]}</p>
                                        <p>Registration number: {usersData["registrationNumber"]}</p>
                                        <p>Family name: {usersData["familyName"]}</p>
                                        <p>Surename: {usersData["surename"]}</p>
                                        <p>Given name: {usersData["givenName"]}</p>
                                        <p>Sex: {usersData["sex"]}</p>
                                        <p>Date of birth: {usersData["dateOfBirth"]}</p>
                                    </CardBody>
                                    <Divider />
                                    <CardFooter>
                                    </CardFooter>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
