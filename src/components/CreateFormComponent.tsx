import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Resource } from "./Interfaces";

const storageEndpoint = `${import.meta.env.VITE_SERVER}${
  import.meta.env.VITE_STORAGE_ENDPOINT
}`;

const categoryEndpoint = `${import.meta.env.VITE_SERVER}${
  import.meta.env.VITE_CATEGORY_ENDPOINT
}`;

// Data can represent Storage Area or Category


interface CreateFormComponentProps {
  authToken: string;
  formTitle: string;
  resource?: Resource | null;
  triggerRefetch: () => void;
  onCancel: () => void;
}

const CreateFormComponent: React.FC<CreateFormComponentProps> = ({
  authToken,
  formTitle,
  resource,
  //   triggerRefetch,
  onCancel,
}) => {
  console.log(authToken);
  console.log(formTitle);
  console.log(resource?.parentId);
  console.log(resource?.id);
  console.log(resource?.name);

  const [parentId, setParentId] = useState<number | null>(
    resource?.parentId || null
  );
  const [id, setId] = useState<number | null>(resource?.id || null);
  const [name, setName] = useState<string>(resource?.name || "");

  useEffect(() => {
    if (resource) {
      setParentId(resource.parentId);
      setId(resource.id);
      setName(resource.name);
    }
  }, [resource]);

  // Perform HTTP request
  const createResource = async (
    url: string,
    resource: object,
    method: string
  ) => {
    const requestOptions = {
      method: `${method}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `${authToken}`,
      },
      body: JSON.stringify(resource),
    };

    try {
      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to create/update resource: ${response.status} - ${errorData.message}`
        );
      }

      const responseData = await response.json();
      console.log("Resource created/updated:", JSON.stringify(responseData[0]));
      //   triggerRefetch();
      //   onCancel();
    } catch (error) {
      console.error(
        "Error creating/updating resource:",
        (error as Error).message
      );
    }
  };

  // Function called when we click submit button
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const content = {
      parentId,
      id: id,
      name: name,
    };

    let endpoint = "";

    if (formTitle == "Create Storage Area") {
      endpoint = storageEndpoint;
    }

    if (formTitle == "Create Category") {
      endpoint = categoryEndpoint;
    }

    if (resource !== null && resource !== undefined && resource.id != -1) {
      const updatedDataContent = { ...resource, ...content };
      await createResource(
        `${endpoint}/${resource.id}`,
        updatedDataContent,
        "PUT"
      );
    } else {
      if (resource) await createResource(endpoint, resource, "POST");
    }
  };

  return (
    <>
      <div className="main-card">
        <div className="main-card-header">
          <div className="main-card-title"> New {formTitle}</div>
        </div>
        <div className="main-card-text-container">
          <form className="login-form" onSubmit={handleSubmit}>
            <label>
              Name:
              <input
                type="text"
                className="login-form-input"
                value={name}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
              />
            </label>
            <br />

            <button type="submit" className="login-form-input">
              {resource ? "Update" : "Submit"}
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="login-form-input"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
      <div></div>
    </>
  );
};

export default CreateFormComponent;
