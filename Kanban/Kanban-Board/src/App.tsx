import WorkspaceList from "./components/workspaceList";
import WorkspaceView from "./components/WorkspaceView";
import ModalRoot from "./components/modals/modalRoot";
import { useModalStore } from "./stores/modalStore";
import { MODAL_TYPE } from "./types/modal";
import { Plus } from "lucide-react";

function App() {
  const openModal = useModalStore((state) => state.openModal);

  return (
    <main className="min-h-screen min-w-screen bg-slate-800 p-6">
      <div className="mx-auto flex gap-6">
        <aside className="w-72 rounded-2x p-4 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-bold">Workspaces</h1>

            <button
              type="button"
              onClick={() =>
                openModal({
                  type: MODAL_TYPE.CREATE_WORKSPACE,
                })
              }
              className="rounded-lg items-center bg-violet-800 px-4 py-2 ml-3 mt-4 text-white transition hover:bg-violet-500 active:scale-95 cursor-pointer"
            >
              <Plus size={26} />
            </button>
          </div>

          <WorkspaceList />
        </aside>

        <section className="flex-1">
          <WorkspaceView />
        </section>
      </div>

      <ModalRoot />
    </main>
  );
}

export default App;
