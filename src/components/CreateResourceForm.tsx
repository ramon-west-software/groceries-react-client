import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Resource } from "./Interfaces";

const storageEndpoint = `${import.meta.env.VITE_SERVER}${
  import.meta.env.VITE_STORAGE_ENDPOINT
}`;

const categoryEndpoint = `${import.meta.env.VITE_SERVER}${
  import.meta.env.VITE_CATEGORY_ENDPOINT
}`;

// Data can represent Storage Area or Category
interface CreateResourceFormProps {
  authToken: string;
  formTitle: string | null;
  resource?: Resource | null;
  triggerRefetch: () => void;
  onCancel: () => void;
  handleRequest: () => void;
}

const CreateResourceForm: React.FC<CreateResourceFormProps> = ({
  authToken,
  formTitle,
  resource,
  //   triggerRefetch,
  onCancel,
  handleRequest
}) => {
  const [parentId, setParentId] = useState<number | null>(
    resource?.parentId || null
  );
  const [id, setId] = useState<number | null>(resource?.id || null);
  const [name, setName] = useState<string | null>(resource?.name || "");

  useEffect(() => {
    if (resource?.name != null) {
      setParentId(resource.parentId);
      setId(resource.id);
      setName(resource.name);
    }
  }, [resource]);

  // Perform HTTP request
  const createResource = async (
    url: string,
    resource: Resource,
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
      // call this function to pull all data and re-render components!!
      handleRequest();

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

    // represents resource updated by form input
    const content = {
      parentId,
      id: id,
      name: name,
    };

    let endpoint = "";

    if (formTitle == `${import.meta.env.VITE_STORAGE_TITLE}`) {
      endpoint = storageEndpoint;
    }

    if (formTitle == `${import.meta.env.VITE_CATEGORY_TITLE}`) {
      endpoint = categoryEndpoint;
    }
    const updatedDataContent = { ...resource, ...(content as Resource) };
    if (
      updatedDataContent !== null &&
      updatedDataContent !== undefined &&
      updatedDataContent.id != null
    ) {
      await createResource(
        `${endpoint}/${updatedDataContent.id}`,
        updatedDataContent,
        "PUT"
      );
    } else {
      if (updatedDataContent && updatedDataContent?.id == null) {
        await createResource(endpoint, updatedDataContent, "POST");
      }
    }
  };

  return (
    <>
      <div className="main-card">
        <div className="main-card-header">
          <div className="main-card-title"> {resource?.id != null ? "Edit" : "New"} {resource?.type}</div>
        </div>
        <div className="main-card-text-container">
          <form className="login-form" onSubmit={handleSubmit}>
            <label>
              Name:
              <input
                type="text"
                className="login-form-input"
                value={name ? name : ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setName(e.target.value);
                }}
              />
            </label>
            <br />

            <button type="submit" className="login-form-input">
              {resource?.name != null ? "Update" : "Submit"}
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

export default CreateResourceForm;
