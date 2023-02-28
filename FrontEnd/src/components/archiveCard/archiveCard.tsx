import { BsArchive, BsLink45Deg, BsThreeDotsVertical } from "react-icons/bs";
import { FaFolder } from "react-icons/fa";
import "./archiveCard.sass";
import { FcFile, FcPicture, FcStart, FcHeadset } from "react-icons/fc";
import { AiOutlineDownload, AiOutlineFilePdf } from "react-icons/ai";
import { CiTrash } from "react-icons/ci";
import {
  MdOutlineDriveFileMove,
  MdOutlineSettingsBackupRestore,
} from "react-icons/md";
import { useContext, useState } from "react";
import CardModalContext from "../../context/cardModalContext";
import { IoMdCloseCircleOutline } from "react-icons/io";
import React from "react";
import { useLocation } from "react-router-dom";
import Axios from "../../utils/AxiosConfig";
import CardPageReload from "../../context/cardPageReload";
import { toast } from "react-toastify";

type ArchiveTypes = "file" | "txt" | "jpeg" | "png" | "mp3" | "mp4" | string;
type PropType = {
  cardTitle: string;
  ArchiveTypes: ArchiveTypes;
  date: string;
  fileSize: string;
  itemKey: string;
  restore?: string;
  cardType?: string;
};
const iconsArray = {
  file: <FaFolder />,
  txt: <FcFile />,
  pdf: <AiOutlineFilePdf />,
  jpeg: <FcPicture />,
  png: <FcPicture />,
  gif: <FcPicture />,
  mp3: <FcHeadset />,
  mp4: <FcStart />,
  default: <FcFile />,
};

export function ArchiveCard({
  ArchiveTypes,
  cardTitle,
  date,
  fileSize,
  itemKey,
  cardType,
  restore,
}: PropType) {
  const [isModalCarOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  const { isModalCardOpen, setIsCardModalOpen } = useContext(CardModalContext); // context
  const { isCardReload, setIsCardReload } = useContext(CardPageReload);
  const bucketName = localStorage.getItem("bucketName");


  function openCardModal() {
    if (isModalCardOpen) {
      return;
    } else {
      setIsCardModalOpen(true);
      setIsModalOpen(true);
    }
  }
  function closeModal() {
    setIsCardModalOpen(false);
    setIsModalOpen(false);
  }
  React.useEffect(() => {
    // runs on location, i.e. route, change
    setIsCardModalOpen(false);
  }, [location]);

  async function Recuperar() {
    await Axios.get(
      `http://localhost:8081/restore/${bucketName}/${itemKey}`
    )
      .then((data) => {
        setIsCardReload(!isCardReload);
        return toast.success(
          "Processo de recuperação do arquivo iniciada com sucesso"
        );
      })
      .catch(() => {
        return toast.error(
          "Processo de recuperação do arquivo nao pode ser iniciada"
        );
      });
  }
  async function GerarLink() {
    await Axios.get(
      `http://localhost:8081/url/${bucketName}/${itemKey}`
    )
      .then((data) => {
        navigator.clipboard.writeText(data.data.url);
        return toast.success("Link copiado com sucesso");
      })
      .catch((e) => {
        return toast.error("Erro ao copiar o link");
      });
  }
  async function arquivar() {
    await Axios.put(
      `http://localhost:8081/updateForGlacier/${bucketName}/${itemKey}`
    )
      .then((data) => {
        setIsCardReload(!isCardReload);
        return toast.success("Item arquivado com sucesso");
      })
      .catch(() => {
        return toast.error("erro ao arquivar o arquivo");
      });
  }
  async function Lixeira() {
    await Axios.put(
      `http://localhost:8081/updateForGlacierIR/${bucketName}/${itemKey}`
    )
      .then((data) => {
        setIsCardReload(!isCardReload);
        return toast.success("O Item foi colocado na lixeira");
      })
      .catch(() => {
        return toast.error("Erro ao colocar o item na lixeira");
      });
  }
  async function Remover() {
    await Axios.delete(
      `http://localhost:8081/${bucketName}/${itemKey}`
    )
      .then((data) => {
        setIsCardReload(!isCardReload);
        return toast.success("O Item foi deletado permanentemente");
      })
      .catch(() => {
        return toast.error("Erro ao remover o item");
      });
  }
  async function RecuperarDaLixeira() {
    await Axios.put(
      `http://localhost:8081/trash/restore/${bucketName}/${itemKey}`
    )
      .then((data) => {
        setIsCardReload(!isCardReload);
        return toast.success("Restauração bem sucedida");
      })
      .catch(() => {
        return toast.error("Erro ao Restaurar o item");
      });
  }

  return (
    <>
      <div className="cardItem">
        <div
          className={
            restore == "restored"
              ? "card restore"
              : restore == "false"
              ? "card no_retored"
              : restore == "in_process"
              ? "card in_process"
              : "card"
          }
        >
          <div className="section1">
            <div className="cardHeader">
              <div className="icoFile">
                {iconsArray[ArchiveTypes]
                  ? iconsArray[ArchiveTypes]
                  : iconsArray["default"]}
              </div>
              <div className="icoAction" onClick={() => openCardModal()}>
                <BsThreeDotsVertical />
              </div>
            </div>
            <div className="cardTitle">
              <h3>{cardTitle}</h3>
            </div>
            <div className="cardDate">
              <div className="date">{date}</div>
            </div>
          </div>

          <div className="fileDetails">
            <div className="fileSize">{fileSize}</div>
          </div>
        </div>
        {/* modal */}
        <div className={isModalCarOpen ? "cardModal selected" : "cardModal"}>
          <div className="modalCloser" onClick={() => closeModal()}>
            <div className="closeIco">
              <IoMdCloseCircleOutline />
            </div>
          </div>
          {cardType === "STANDARD" ? (
            <div className="options">
              <div className="option" onClick={() => closeModal()}>
                <div className="optionIco">
                  <AiOutlineDownload />
                </div>
                <div className="optiontext">
                  <a
                    href={`http://localhost:8081/${bucketName}/${itemKey}`}
                  >
                    Download
                  </a>
                </div>
              </div>
              <div
                className="option"
                onClick={() => {
                  closeModal();
                  arquivar();
                }}
              >
                <div className="optionIco">
                  <BsArchive />
                </div>
                <div className="optiontext">Arquivar</div>
              </div>
              <div
                className="option"
                onClick={() => {
                  closeModal();
                  GerarLink();
                }}
              >
                <div className="optionIco">
                  <BsLink45Deg />
                </div>
                <div className="optiontext">Gerar Link</div>
              </div>
              <div className="option" onClick={() => closeModal()}>
                <div className="optionIco">
                  <MdOutlineDriveFileMove />
                </div>
                <div className="optiontext">Mover Para</div>
              </div>
              <div
                className="option"
                onClick={() => {
                  closeModal();
                  Lixeira();
                }}
              >
                <div className="optionIco">
                  <CiTrash />
                </div>
                <div className="optiontext">Lixeira</div>
              </div>
            </div>
          ) : cardType === "GLACIER" && restore === "restored" ? (
            <div className="options">
              <div className="option" onClick={() => closeModal()}>
                <div className="optionIco">
                  <AiOutlineDownload />
                </div>
                <div className="optiontext">
                  <a
                    href={`http://localhost:8081/${bucketName}/${itemKey}`}
                  >
                    Download
                  </a>
                </div>
              </div>

              <div
                className="option"
                onClick={() => {
                  closeModal();
                  GerarLink();
                }}
              >
                <div className="optionIco">
                  <BsLink45Deg />
                </div>
                <div className="optiontext">Gerar Link</div>
              </div>
              <div
                className="option"
                onClick={() => {
                  closeModal();
                  RecuperarDaLixeira();
                }}
              >
                <div className="optionIco">
                  <MdOutlineSettingsBackupRestore />
                </div>
                <div className="optiontext">Recuperar</div>
              </div>
              <div
                className="option"
                onClick={() => {
                  closeModal();
                  Remover();
                }}
              >
                <div className="optionIco">
                  <CiTrash />
                </div>
                <div className="optiontext">Remover</div>
              </div>
            </div>
          ) : cardType === "GLACIER" && restore === "in_process" ? (
            <div className="options">
              <div
                className="option"
                onClick={() => {
                  closeModal();
                  toast.error("item em processo de restauração");
                }}
              >
                <div className="optionIco">
                  <MdOutlineSettingsBackupRestore />
                </div>
                <div className="optiontext">Recuperar</div>
              </div>
            </div>
          ) : cardType === "GLACIER" ? (
            <div className="options">
              <div
                className="option"
                onClick={() => {
                  closeModal();
                  Recuperar();
                }}
              >
                <div className="optionIco">
                  <MdOutlineSettingsBackupRestore />
                </div>
                <div className="optiontext">Recuperar</div>
              </div>
              <div
                className="option"
                onClick={() => {
                  closeModal();
                  Remover();
                }}
              >
                <div className="optionIco">
                  <CiTrash />
                </div>
                <div className="optiontext">Remover</div>
              </div>
            </div>
          ) : cardType === "GLACIER_IR" ? (
            <div className="options">
              <div className="option" onClick={() => closeModal()}>
                <div className="optionIco">
                  <AiOutlineDownload />
                </div>
                <div className="optiontext">
                  <a
                    href={`http://localhost:8081/${bucketName}/${itemKey}`}
                  >
                    Download
                  </a>
                </div>
              </div>
              <div
                className="option"
                onClick={() => {
                  closeModal();
                  arquivar();
                }}
              >
                <div className="optionIco">
                  <BsArchive />
                </div>
                <div className="optiontext">Arquivar</div>
              </div>
              <div
                className="option"
                onClick={() => {
                  closeModal();
                  GerarLink();
                }}
              >
                <div className="optionIco">
                  <BsLink45Deg />
                </div>
                <div className="optiontext">Gerar Link</div>
              </div>
              <div
                className="option"
                onClick={() => {
                  closeModal();
                  RecuperarDaLixeira();
                }}
              >
                <div className="optionIco">
                  <MdOutlineSettingsBackupRestore />
                </div>
                <div className="optiontext">Recuperar</div>
              </div>
              <div
                className="option"
                onClick={() => {
                  closeModal();
                  Remover();
                }}
              >
                <div className="optionIco">
                  <CiTrash />
                </div>
                <div className="optiontext">Remover</div>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
}
