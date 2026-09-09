import { useEffect, useState } from "react";
import Alert from "./Alert";
import AdminStatusBadge from "./AdminStatusBadge";
import { createResource, createResourceType, deleteResource, getAllResourceTypes, getAllResources,
  updateResource, type Resource, type ResourceType, type ResourceZone, } from "../../services/resourceService";

type ResourceForm = {
  name: string;
  resourceTypeId: string;
  zone: ResourceZone | "";
  capacity: number | "";
};

const emptyForm: ResourceForm = {
  name: "",
  resourceTypeId: "",
  zone: "",
  capacity: "",
};
const fieldStyle = {
  width: "100%",
  boxSizing: "border-box" as const,
  background: "#111e2d",
  border: "1px solid #1e3347",
  borderRadius: 10,
  padding: "10px 12px",
  color: "#e2eaf2",
  fontSize: 14,
};

function ResourceModal({
  form,
  types,
  editing,
  alert,
  newTypeName,
  creatingType,
  onNewTypeNameChange,
  onAddResourceType,
  onChange,
  onSubmit,
  onClose,
  onClearAlert,
}: {
  form: ResourceForm;
  types: ResourceType[];
  editing: boolean;
  alert: string;
  newTypeName: string;
  creatingType: boolean;
  onChange: (form: ResourceForm) => void;
  onSubmit: (event: React.FormEvent) => void;
  onClose: () => void;
  onClearAlert: () => void;
  onNewTypeNameChange: (name: string) => void;
  onAddResourceType: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(8,14,20,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#0d1824",
          border: "1px solid #1e3347",
          borderRadius: 16,
          padding: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h2
            style={{
              margin: 0,
              color: "#e2eaf2",
              fontFamily: "Outfit, sans-serif",
              fontSize: 18,
            }}
          >
            {editing ? "Redigera resurs" : "Lägg till resurs"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#7a94aa",
              fontSize: 24,
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 16 }}>
          <label style={{ color: "#7a94aa", fontSize: 14 }}>
            Resursnamn
            <input
              required
              value={form.name}
              onChange={(event) =>
                onChange({ ...form, name: event.target.value })
              }
              style={{ ...fieldStyle, display: "block", marginTop: 8 }}
              placeholder="T.ex. Mötesrum"
            />
          </label>
          <label style={{ color: "#7a94aa", fontSize: 14 }}>
            Resurstyp
            <select
              required
              value={form.resourceTypeId}
              onChange={(event) =>
                onChange({ ...form, resourceTypeId: event.target.value })
              }
              style={{ ...fieldStyle, display: "block", marginTop: 8 }}
            >
              <option value="">Välj resurstyp</option>
              {types.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <input
                value={newTypeName}
                onChange={(event) => onNewTypeNameChange(event.target.value)}
                placeholder="T.ex. Sensor"
                style={{ ...fieldStyle, marginTop: 0 }}
              />

              <button type="button" onClick={onAddResourceType} disabled={creatingType}
              style={{whiteSpace: "nowrap", background: "#111e2d", border: "1px solid #1e3347",
                borderRadius: 10, padding: "0 12px", color:"#00d4aa", cursor: creatingType ? "wait" : "pointer",
              }}>
                {creatingType ? "Skapar..." : "+ Ny typ"}
              </button>
            </div>

          </label>

          <label style={{ color: "#7a94aa", fontSize: 14 }}>
            Zon
            <select
              required
              value={form.zone}
              onChange={(event) =>
                onChange({
                  ...form,
                  zone:
                    event.target.value === ""
                      ? ""
                      : (Number(event.target.value) as ResourceZone),
                })
              }
              style={{ ...fieldStyle, display: "block", marginTop: 8 }}
            >
              <option value="">Välj zon</option>
              <option value={0}>Zon A</option>
              <option value={1}>Zon B</option>
              <option value={2}>Zon C</option>
            </select>
          </label>

          <label style={{ color: "#7a94aa", fontSize: 14 }}>
            Kapacitet
            <input
              required
              type="number"
              min="1"
              placeholder="T.ex. 15" 
              value={form.capacity}
              onChange={(event) =>
                onChange({
                  ...form,
                  capacity:
                    event.target.value === "" ? "" : Number(event.target.value),
                })
              }
              style={{ ...fieldStyle, display: "block", marginTop: 8 }}
            />
          </label>
          {alert && (
            <Alert message={alert} type="error" onClose={onClearAlert} />
          )}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "transparent",
                border: "1px solid #1e3347",
                color: "#7a94aa",
                borderRadius: 10,
                padding: "10px 14px",
                cursor: "pointer",
              }}
            >
              Avbryt
            </button>
            <button
              type="submit"
              style={{
                background: "#00d4aa",
                border: "none",
                color: "#080e14",
                borderRadius: 10,
                padding: "10px 16px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {editing ? "Uppdatera resurs" : "Spara resurs"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ResourcesAdmin() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [types, setTypes] = useState<ResourceType[]>([]);
  const [form, setForm] = useState<ResourceForm>(emptyForm);
  const [editing, setEditing] = useState<Resource | null>(null);
  const [deleting, setDeleting] = useState<Resource | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [alert, setAlert] = useState("");
  const [newTypeName, setNewTypeName] = useState("");
  const [creatingType, setCreatingType] = useState(false);

  useEffect(() => {
    Promise.all([getAllResources(), getAllResourceTypes()])
      .then(([loadedResources, loadedTypes]) => {
        setResources(loadedResources);
        setTypes(loadedTypes);
      })
      .catch(() => setAlert("Kunde inte hämta resurser"));
  }, []);

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
    setForm(emptyForm);
    setNewTypeName("");
    setAlert("");
  };

  const openResourceForm = async () => {
    try {
      const loadedTypes = await getAllResourceTypes();
      setTypes(loadedTypes);
      setForm(emptyForm);
      setEditing(null);
      setAlert("");
      setFormOpen(true);
    } catch {
      setAlert("Kunde inte hämta resurstyper")
    }
  }

  const addResourceType = async () => {
    const name = newTypeName.trim();

    if (!name) {
      setAlert("Ange ett namn på resurstypen");
      return;
    }

    try {
      setCreatingType(true);
      const createdType = await createResourceType(name, "");
       setTypes((current) => [...current, createdType]);

        setForm((current) => ({
      ...current,
      resourceTypeId: createdType.id,
   }));

      setNewTypeName("");
      setAlert("");
    } catch {
      setAlert("Kunde inte skapa resurstyp")
    } finally {
      setCreatingType(false)
    }
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (
      !form.name.trim() ||
      !form.resourceTypeId ||
      form.zone === "" ||
      form.capacity === "" ||
      form.capacity < 1
    ) {
      setAlert("Fyll i alla fält");
      return;
    }
    const resourceData = {
      name: form.name.trim(),
      resourceTypeId: form.resourceTypeId,
      zone: form.zone as ResourceZone,
      capacity: form.capacity,
    };
    try {
      if (editing) {
        await updateResource(editing.id, {
          ...resourceData,
          isActive: editing.isActive,
        });
        const resourceType = types.find(
          (type) => type.id === form.resourceTypeId,
        );
        if (resourceType)
          setResources((current) =>
            current.map((resource) =>
              resource.id === editing.id
                ? {
                    ...resource,
                    ...resourceData,
                    resourceType,
                  }
                : resource,
            ),
          );
      } else {
        const createdResource = await createResource(resourceData);
        setResources((current) => [createdResource, ...current]);
      }
      closeForm();
    } catch {
      setAlert(
        editing ? "Kunde inte uppdatera resurs" : "Kunde inte skapa resurs",
      );
    }
  };

  const remove = async () => {
    if (!deleting) return;
    try {
      await deleteResource(deleting.id);
      setResources((current) =>
        current.filter((resource) => resource.id !== deleting.id),
      );
    } catch {
      setAlert("Kunde inte ta bort resurs");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: "Outfit, sans-serif", color: "#e2eaf2" }}
        >
          Resurser
        </h1>
        <button
          onClick={openResourceForm}
          className="px-4 py-2 rounded-lg text-sm font-semibold"
          style={{ background: "#00d4aa", color: "#080e14", cursor: "pointer"}}
        >
          + Ny resurs
        </button>
      </div>
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid #1e3347" }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ background: "#111e2d" }}>
              {["Resurs", "Typ", "Zon", "Status", "Kapacitet", "Åtgärd"].map(
                (heading) => (
                  <th
                    key={heading}
                    className="px-4 py-3 text-left text-xs"
                    style={{ color: "#7a94aa" }}
                  >
                    {heading}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {resources.map((resource, index) => (
              <tr
                key={resource.id}
                style={{
                  borderBottom: "1px solid #1e3347",
                  background: index % 2 ? "#0a1520" : "transparent",
                }}
              >
                <td className="px-4 py-3 text-sm" style={{ color: "#e2eaf2" }}>
                  {resource.name}
                </td>
                <td className="px-4 py-3 text-sm" style={{ color: "#7a94aa" }}>
                  {resource.resourceType.name}
                </td>
                <td className="px-4 py-3 text-sm" style={{ color: "#7a94aa" }}>
                  {resource.zone === null
                    ? "Ingen zon"
                    : `Zon ${String.fromCharCode(65 + resource.zone)}`}
                </td>
                <td className="px-4 py-3">
                  <AdminStatusBadge
                    status={resource.isActive ? "active" : "inactive"}
                  />
                </td>
                <td
                  className="px-4 py-3 text-sm mono"
                  style={{ color: "#7a94aa" }}
                >
                  {resource.capacity}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditing(resource);
                        setForm({
                          name: resource.name,
                          resourceTypeId: resource.resourceType.id,
                          zone: resource.zone ?? "",
                          capacity: resource.capacity,
                        });
                        setFormOpen(true);
                      }}
                      className="text-xs px-3 py-2 rounded-lg"
                      style={{
                        background: "#111e2d",
                        color: "#7a94aa",
                        border: "1px solid #1e3347",
                        cursor: "pointer"
                      }}
                    >
                      Redigera
                    </button>
                    <button
                      onClick={() => setDeleting(resource)}
                      className="text-xs px-3 py-2 rounded-lg"
                      style={{
                        background: "rgba(244,63,94,0.1)",
                        color: "#f43f5e",
                        border: "1px solid rgba(244,63,94,0.25)",
                        cursor: "pointer"
                      }}
                    >
                      Ta bort
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {alert && !formOpen && (
          <div className="p-4">
            <Alert message={alert} type="error" onClose={() => setAlert("")} />
          </div>
        )}
      </div>
      {formOpen && (
        <ResourceModal
          form={form}
          types={types}
          editing={Boolean(editing)}
          alert={alert}
          newTypeName={newTypeName}
          creatingType={creatingType}
          onNewTypeNameChange={setNewTypeName}
          onAddResourceType={addResourceType}
          onChange={setForm}
          onSubmit={submit}
          onClose={closeForm}
          onClearAlert={() => setAlert("")}
        />
      )}
      {deleting && (
        <Alert
          message={`Vill du ta bort resursen ${deleting.name}?`}
          type="confirm"
          onClose={() => setDeleting(null)}
          onConfirm={remove}
        />
      )}
    </div>
  );
}