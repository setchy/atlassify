import { type FC, useCallback, useContext, useState } from 'react';

import { Box, Flex, Grid, Inline, Stack, xcss } from '@atlaskit/primitives';

import Button, { IconButton } from '@atlaskit/button/new';
import CrossIcon from '@atlaskit/icon/glyph/cross';

import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '@atlaskit/modal-dialog';

import { Header } from '../components/Header';
import { AppearanceSettings } from '../components/settings/AppearanceSettings';
import { NotificationSettings } from '../components/settings/NotificationSettings';
import { SettingsFooter } from '../components/settings/SettingsFooter';
import { SystemSettings } from '../components/settings/SystemSettings';
import { AppContext } from '../context/App';

const gridStyles = xcss({
  width: '100%',
});

const closeContainerStyles = xcss({
  gridArea: 'close',
});

const titleContainerStyles = xcss({
  gridArea: 'title',
});

export const SettingsRoute: FC = () => {
  const { resetSettings } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  return (
    <div className="flex h-screen flex-col" data-testid="settings">
      <Header fetchOnBack>Settings</Header>

      <div className="flex flex-col flex-grow overflow-x-auto px-8">
        <Stack space="space.400">
          <AppearanceSettings />
          <NotificationSettings />
          <SystemSettings />

          <Inline alignInline="center">
            <Box paddingBlockEnd="space.400">
              <Button
                aria-haspopup="dialog"
                appearance="danger"
                onClick={openModal}
              >
                Reset Settings
              </Button>

              <ModalTransition>
                {isOpen && (
                  <Modal onClose={closeModal}>
                    <ModalHeader>
                      <Grid
                        gap="space.200"
                        templateAreas={['title close']}
                        xcss={gridStyles}
                      >
                        <Flex xcss={closeContainerStyles} justifyContent="end">
                          <IconButton
                            appearance="subtle"
                            icon={CrossIcon}
                            label="Close Modal"
                            onClick={closeModal}
                          />
                        </Flex>
                        <Flex
                          xcss={titleContainerStyles}
                          justifyContent="start"
                        >
                          <ModalTitle appearance="danger">
                            Reset Settings
                          </ModalTitle>
                        </Flex>
                      </Grid>
                    </ModalHeader>
                    <ModalBody>
                      <p>
                        Please confirm that you want to reset all settings to
                        the <strong>Atlasify defaults</strong>.
                      </p>
                    </ModalBody>
                    <ModalFooter>
                      <Button appearance="subtle" onClick={() => closeModal()}>
                        Cancel
                      </Button>
                      <Button
                        appearance="danger"
                        onClick={() => {
                          resetSettings();
                          closeModal();
                        }}
                      >
                        Reset
                      </Button>
                    </ModalFooter>
                  </Modal>
                )}
              </ModalTransition>
            </Box>
          </Inline>
        </Stack>
      </div>

      <SettingsFooter />
    </div>
  );
};
