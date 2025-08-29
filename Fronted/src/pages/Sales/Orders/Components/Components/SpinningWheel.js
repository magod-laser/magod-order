import { Box, Modal } from "@mui/material";
import PropTypes from "prop-types";
import { FadeLoader } from "react-spinners";

export default function SpinningWheel(props) {
  return (
    <Modal
      open={props.open}
      className="spin-modal"
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "rgba(255, 255, 255, 0.69)",
          },
        },
      }}
    >
      <Box className="spin-content">
        <FadeLoader color="darkblue" />
        <p className="spin-text">Loading.......</p>
      </Box>
    </Modal>
  );
}

SpinningWheel.propTypes = {
  open: PropTypes.bool.isRequired,
};
