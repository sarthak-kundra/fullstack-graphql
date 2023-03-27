import React, { useState } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { v4 as uuidv4 } from 'uuid';
import PetsList from "../components/PetsList";
import NewPetModal from "../components/NewPetModal";
import Loader from "../components/Loader";

const ALL_PETS = gql`
  query AllPets {
    pets {
      name
      id
      type
      img
    }
  }
`;

const CREATE_PET = gql`
  mutation CreatePet($petData: NewPetInput!) {
    addPet(input: $petData) {
      id
      name
      type
      img
    }
  }
`;

export default function Pets() {
  const [modal, setModal] = useState(false);
  const { loading, error, data } = useQuery(ALL_PETS);
  const [createPet, createPetMutationObj] = useMutation(CREATE_PET, {
    update(cache, {data: { addPet }}) {
      const  data  = cache.readQuery({ query: ALL_PETS });
      cache.writeQuery({
        query: ALL_PETS,
        data: { pets: [addPet, ...data.pets]}
      })
    }
  });

  const onSubmit = (input) => {
    setModal(false);
    createPet({
      variables: {
        petData: input
      },
      optimisticResponse: {
        __typename: "Mutation.addPet",
        addPet: {
          id: uuidv4(),
          name: input.name,
          type: input.type,
          img: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.dailypaws.com%2Fdogs-puppies%2Fdog-breeds%2Fsiberian-husky&psig=AOvVaw2lYX29BHuVSxPQ77TX4S_r&ust=1679974110001000&source=images&cd=vfe&ved=0CBAQjRxqFwoTCMDasrOV-_0CFQAAAAAdAAAAABAD",
          __typename: "dgfsaa"
        }

      }
    })
  };

  if(loading || createPetMutationObj.loading) {
    <Loader />
  }
  if (modal) {
    return <NewPetModal onSubmit={onSubmit} onCancel={() => setModal(false)} />;
  }

  return (
    <div className="page pets-page">
      <section>
        <div className="row betwee-xs middle-xs">
          <div className="col-xs-10">
            <h1>Pets</h1>
          </div>

          <div className="col-xs-2">
            <button onClick={() => setModal(true)}>new pet</button>
          </div>
        </div>
      </section>
      <section>{!loading && <PetsList pets={data.pets} />}</section>
    </div>
  );
}
