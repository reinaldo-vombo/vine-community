import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover"
import CreateComunity from "./CreateComunity"


const OrganizationSwitcher = () => {
   const user = {
      name: "Reinaldo Vombo",
      organization: [
         {
            id: "jwecwencwec",
            name: "AGT",
            photo: "",
         }
      ]
   }
   const username = "Reinaldo Vombo"
   const name = username.charAt(0)

   return (
      <Popover>
         <PopoverTrigger className="OrganizationSwitcher">
            <div className="comunityBox">
               {name}
            </div>
            <p className="text-[12px]">Conta pessoal</p>
         </PopoverTrigger>
         {/* if add this classes to css class it will be overwriten by PopoverContent default style */}
         <PopoverContent className="bg-[#19191a] text-white py-6 rounded-2xl border-none space-y-5 text-[12px]">
            <div className="oragenization">
               <div className="comunityBox">
                  {name}
               </div>
               <p>Conta pessoal</p>
            </div>
            <div className="comunity">
               {user.organization.length > 0 ? user.organization.map((item) => (
                  <div key={item.id}></div>
               )) : <></>}
               <CreateComunity />
            </div>
         </PopoverContent>
      </Popover>

   )
}

export default OrganizationSwitcher
