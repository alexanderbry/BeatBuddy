import { useEffect, useState } from "react";
import { Button, Card, Label, Modal, TextInput } from "flowbite-react";
import { spotifyApi } from "../api";
import { createNewPost } from "../redux/storePost";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";

export default function ModalButton() {
  const [openModal, setOpenModal] = useState(false);
  const [inputSearch, setInputSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const dispatch = useDispatch();
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      let data = await spotifyApi.get(`/search?q=${inputSearch}&type=track`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("spotifyToken")}`,
        },
      });
      setSearchResults(data.data.tracks.items);
    } catch (error) {
      Swal.fire({
        title: error.response?.data.error.message,
        width: 600,
        padding: "3em",
        color: "#716add",
        background: "#fff url(/images/trees.png)",
        backdrop: `
          rgba(0,0,123,0.4)
          url("/images/nyan-cat.gif")
          left top
          no-repeat
        `
      });
    }
  };

  useEffect(() => {
    dispatch(createNewPost({ TrackId: selectedTrack }));
  }, [selectedTrack]);

  return (
    <>
      <Button type="button" onClick={() => setOpenModal(true)} color="gray">
        Find Track
      </Button>
      <Modal
        dismissible
        show={openModal}
        onClose={() => setOpenModal(false)}
        size="7xl"
      >
        <Modal.Header>
          <form className="flex flex-col gap-4 w-full" onSubmit={handleSearch}>
            <div className="flex flex-row gap-4 items-end">
              <div className="flex-grow">
                <div className="mb-2 block">
                  <Label htmlFor="base" value="Search Track" />
                </div>
                <TextInput
                  id="base"
                  type="text"
                  sizing="md"
                  color="gray"
                  value={inputSearch}
                  onChange={(e) => setInputSearch(e.target.value)}
                  placeholder="Enter track name..."
                />
              </div>
              <Button color="dark" type="submit">
                Search
              </Button>
            </div>
          </form>
        </Modal.Header>
        <Modal.Body>
          {searchResults.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 max-h-[60vh] overflow-y-auto p-4 h-96">
              {searchResults.map((track) => (
                <div
                  key={track.id}
                  className={`relative transition-transform transform hover:scale-105 ${
                    selectedTrack === track.id
                      ? "border-2 border-green-500"
                      : "border border-gray-200"
                  }`}
                  onClick={() => setSelectedTrack(track.id)}
                >
                  <Card
                    className="flex flex-col w-full h-64 overflow-hidden rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700"
                    theme={{
                      root: {
                        base: "flex rounded-lg border bg-white shadow-md dark:border-gray-700 dark:bg-gray-800",
                        children: "flex h-full flex-col p-0",
                      },
                    }}
                  >
                    <div className="h-48 w-full">
                      <img
                        src={track.album.images[0]?.url}
                        alt={track.name}
                        className="object-cover w-full h-full rounded-t-lg"
                      />
                    </div>
                    <div className="p-3 text-center flex-grow flex flex-col justify-center">
                      <h5 className="text-sm font-bold tracking-tight text-gray-900 dark:text-white truncate">
                        {track.name}
                      </h5>
                      <p className="text-xs font-normal text-gray-700 dark:text-gray-400 truncate">
                        {track.artists[0].name}
                      </p>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="flex justify-end gap-2">
          <Button onClick={() => setOpenModal(false)} color="green">
            Select
          </Button>
          <Button color="red" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
