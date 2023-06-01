import {EnvelopeIcon, PencilIcon, PhoneIcon, TrashIcon} from "@heroicons/react/20/solid"
import {useQuery} from "react-query"
import {useAppDispatch} from "@/store/hooks"
import {useState} from "react"
import {fetcher} from "@/helpers"
import Loading from "../Loading"
import UpdateMember from "../modals/update-member"
import {setMemberId} from "@/store/slices/members"
import DeleteMember from "../modals/del-member-conf"
import AddMember from "../modals/add-member"
export default function MembersList() {
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [openAddMember, setOpenAddMember] = useState(false)
  const {isLoading, data: members} = useQuery("members", () => fetcher("/api/members"))
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>
    )
  }
  return (
    <div className="mx-12">
      <UpdateMember open={open} setOpen={setOpen} />
      <DeleteMember open={openDelete} setOpen={setOpenDelete} />
      <AddMember open={openAddMember} setOpen={setOpenAddMember} />
      <div className="border-b mx-10 border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between">
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          MEMBRES DE L'EQUIPE
        </h3>
        <div className="mt-3 sm:ml-4 sm:mt-0">
          <button
            onClick={() => setOpenAddMember(true)}
            type="button"
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Nouveau membre
          </button>
        </div>
      </div>{" "}
      <ul
        role="list"
        className="p-4 mt-10 mx-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {members.map((member) => (
          <li
            key={member.id}
            className="border col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow"
          >
            <div className="flex w-full items-center justify-between space-x-6 p-6">
              <div className="flex-1 truncate">
                <div className="flex items-center space-x-3">
                  <h3 className="truncate text-sm font-medium text-gray-900 first-letter:uppercase">
                    {member.username}
                  </h3>
                  <span className="first-letter:uppercase inline-flex flex-shrink-0 items-center rounded-full bg-amber-50 px-1.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                    {member.role}
                    {member.stand ? ` - ${member.stand}` : ""}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <div className="-mt-px flex divide-x divide-gray-200">
                <div className="flex w-0 flex-1">
                  <button
                    onClick={() => {
                      dispatch(setMemberId(member.id));
                      setOpen(true);
                    }}
                    className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                  >
                    <PencilIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    Modifier
                  </button>
                </div>
                <div className="-ml-px flex w-0 flex-1">
                  <button
                    disabled={member.role === "manager"}
                    onClick={() => {
                      dispatch(setMemberId(member.id));
                      setOpenDelete(true);
                    }}
                    className=" disabled:bg-black disabled:text-white relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                  >
                    <TrashIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
