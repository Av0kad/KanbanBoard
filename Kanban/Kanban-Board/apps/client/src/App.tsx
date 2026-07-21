import { useEffect } from "react";
import { LogOut, Plus } from "lucide-react";

import AuthPage from "./components/authPage";
import WorkspaceList from "./components/workspaceList";
import WorkspaceView from "./components/WorkspaceView";
import ModalRoot from "./components/modals/modalRoot";
import { useAuthStore } from "./stores/authStore";
import { useModalStore } from "./stores/modalStore";
import { useWorkspaceStore } from "./stores/workSpaceStore";
import { MODAL_TYPE } from "./types/modal";

function App() {
  const openModal = useModalStore((state) => state.openModal);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const loadWorkspaces = useWorkspaceStore((state) => state.loadWorkspaces);
  const isLoading = useWorkspaceStore((state) => state.isLoading);
  const error = useWorkspaceStore((state) => state.error);

  useEffect(() => {
    if (isAuthenticated) {
      void loadWorkspaces();
    }
  }, [isAuthenticated, loadWorkspaces]);

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <main className="min-h-screen min-w-screen bg-slate-800 p-6 text-white">
      <header className="mb-6 flex items-center justify-end gap-4">
        <span>{user?.email}</span>

        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-2 rounded-lg bg-red-700 px-4 py-2"
        >
          <LogOut size={18} />
          Logout
        </button>
      </header>

      {error && (
        <div className="mb-4 rounded-lg bg-red-900 p-3 text-red-100">
          {error}
        </div>
      )}

      {isLoading ? (
        <div>Loading workspaces...</div>
      ) : (
        <div className="mx-auto flex gap-6">
          <aside className="w-72 rounded-2xl p-4 shadow">
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-xl font-bold">Workspaces</h1>

              <button
                type="button"
                onClick={() =>
                  openModal({
                    type: MODAL_TYPE.CREATE_WORKSPACE,
                  })
                }
                className="ml-3 mt-4 rounded-lg bg-violet-800 px-4 py-2"
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
      )}

      <ModalRoot />
    </main>
  );
}

export default App;
