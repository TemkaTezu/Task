'use client'
import { Button, Input, ButtonGroup, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import Link from "next/link";
import { useState, useEffect } from 'react'

export default function Home() {
  const [registrationNumber, setRegistrationNumber] = useState<string>("");
  const [ciImage, setCIImage] = useState<File | null>(null);
  const [userImage, setUserImage] = useState<File | null>(null);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [title, setTitle] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => { document.title = "Шинээр хэрэглэгч үүсгэх"; }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!registrationNumber || !userImage || !ciImage) {
      setLoading(false);
      setTitle('Алдаа');
      setMessage('Та мэдээллээ бүрэн оруулан уу');
      onOpen();
      return;
    }

    const formData = new FormData();
    formData.append('registrationNumber', registrationNumber);
    if (userImage) {
      formData.append('userImage', userImage);
    }
    if (ciImage) {
      formData.append('ciImage', ciImage);
    }

    setLoading(true);
    setTitle('Уншиж байна');
    setMessage('Та түр хүлээн үү');
    onOpen();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
      method: 'POST',
      headers: {
        'Access-Control-Allow-Credentials': "true",
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,DELETE,PATCH,POST,PUT',
        'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
      },
      body: formData,
    });

    onClose();

    const data = JSON.parse(await response.text());

    if (data.message !== 'OK') {
      setLoading(false);
      setTitle('Алдаа');
      setMessage(data.message);
      onOpen();
    }
    else {
      setLoading(false);
      setTitle('Бүртгэл');
      setMessage('Амжилттай бүртгэгдлээ')
      onOpen();
    }
  };

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

      <form onSubmit={onSubmit} className="flex flex-col items-center">
        <div className="items-stretch space-y-12">
          <div className="flex flex-col space-y-2">
            <span className="ml-2">Регистрийн дугаараа оруулан уу</span>
            <Input
              type="text"
              name="registrationNumber"
              label="Регистрийн дугаар"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <span className="ml-2">Иргэний үнэмлэхийн нүүр зургаа оруулан уу</span>
            <input
              type="file"
              accept="image/*"
              name="ciImage"
              onChange={(e) => setCIImage(e.target.files?.[0] || null)}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <span className="ml-2">Иргэний үнэмлэхээ барьсан зургаа оруулан уу</span>
            <input
              type="file"
              accept="image/*"
              name="userImage"
              onChange={(e) => setUserImage(e.target.files?.[0] || null)}
            />
          </div>

          <Button
            className="w-full"
            color="success"
            variant="shadow"
            type="submit">
            Илгээх
          </Button>
        </div>
      </form>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement='top' className="bg-zinc-900" backdrop='blur' size='xl'>
        <ModalContent>
          {(onClose) => (
            <>
              {title === 'Алдаа' ? (<ModalHeader className="flex flex-col gap-1 text-rose-800">{title}</ModalHeader>) : (<ModalHeader className="flex flex-col gap-1 text-emerald-800">{title}</ModalHeader>)}
              <ModalBody>
                <p>{message}</p>
              </ModalBody>
              <ModalFooter>
                {loading === false ? (<Button color="danger" variant="light" onPress={onClose}>Close</Button>) : null}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
