import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import Comunity from "../forms/Comunity"


const CreateComunity = () => {
   return (
      <Dialog>
         <DialogTrigger className="createComunity w-full">
            <Plus width={15} />
            <p>Criar comunidade</p>
         </DialogTrigger>
         <DialogContent className="bg-[#19191a]">
            <DialogHeader>
               <DialogTitle className="font-semibold text-white text[3rem] py-[2.375rem] px-8">
                  <h1 className="text-[2rem] font-semibold">Criar organização</h1>
               </DialogTitle>
               <DialogDescription>
                  <Comunity />
               </DialogDescription>
            </DialogHeader>
         </DialogContent>
      </Dialog>

   )
}

export default CreateComunity
