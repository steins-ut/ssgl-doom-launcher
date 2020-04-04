import React, { useContext, useState } from 'react';

import { Box, Flex } from '../components';
import {
  Button,
  Checkbox,
  Dropdown,
  FormCollection,
  SelectFile,
  SubmitArea
} from '../components/Form';
import i18n from '../i18n';
import { AVAILABLE_LOCALES } from '../locales';
import { StoreContext } from '../state';
import {
  setTitle,
  useHashLocation,
  useIpc,
  useToast,
  useTranslation
} from '../utils';

const Settings = () => {
  setTitle('settings');
  const { t } = useTranslation(['settings', 'common', 'nav']);
  const { gstate, dispatch } = useContext(StoreContext);
  const { settings } = gstate;
  const [form, setForm] = useState(settings);
  const [errors, setError] = useState({});
  const [toast] = useToast();
  const [saveSettings] = useIpc();
  const [fetchInit, loadInit] = useIpc();
  // eslint-disable-next-line no-unused-vars
  const [loc, navigate] = useHashLocation();

  const themeOptions = [
    {
      label: 'Hell',
      value: 'hell'
    },
    {
      label: 'UAC',
      value: 'uac'
    },
    {
      label: 'Phobos',
      value: 'phobos'
    },
    {
      label: 'Pinkie',
      value: 'pinkie'
    }
  ];
  const viewOptions = [
    {
      label: t('nav:wads'),
      value: '/'
    },
    {
      label: t('nav:packages'),
      value: '/packages'
    }
  ];

  const sourceportOptions = gstate.sourceports.map(item => ({
    label: item.name,
    value: item.id
  }));

  const onComponent = ({ name, value }) => {
    setForm({
      ...form,
      [name]: value ? value : ''
    });
  };

  const validate = () => {
    const fields = ['modpath', 'savepath', 'obligeBinary', 'obligeConfigPath'];

    let temp = {};
    let hasError = false;

    fields
      .filter(field => (form.obligeActive ? true : field.indexOf('oblige') < 0))
      .forEach(field => {
        if (!form[field] || form[field].trim() === '') {
          hasError = true;
          temp = {
            ...temp,
            [field]: t('common:required')
          };
        } else {
          temp = {
            ...temp,
            [field]: null
          };
        }
      });

    setError(temp);

    return hasError;
  };

  const onSubmit = async e => {
    e.preventDefault();
    const hasError = validate();

    if (!hasError) {
      const newSettings = await saveSettings('settings/save', form);
      dispatch({ type: 'settings/save', data: newSettings });

      const newState = await fetchInit('main/init', null);
      dispatch({ type: 'main/init', data: newState });
      i18n.changeLanguage(newState.settings.language);
      toast('ok', t('common:success'), t('settings:toastSaved'));
      if (gstate.sourceports.length < 1) {
        navigate('/sourceports');
      }
    } else {
      toast('danger', t('common:error'), t('common:toastRequired'));
    }
  };

  return (
    <Box>
      <form onSubmit={onSubmit}>
        <FormCollection title={t('settings:titleDirectories')}>
          <Flex.Grid>
            <Flex.Col width="50%">
              <SelectFile
                name="modpath"
                onFile={onComponent}
                label={t('settings:waddir')}
                value={form.modpath}
                error={errors.modpath}
                directory
                info="https://github.com/FreaKzero/ssgl-doom-launcher/wiki/SSGL---First-Setup#wad-directory-required"
                fluid
              />
            </Flex.Col>
            <Flex.Col width="50%">
              <SelectFile
                name="savepath"
                onFile={onComponent}
                label={t('settings:savepath')}
                value={form.savepath}
                error={errors.savepath}
                directory
                info="https://github.com/FreaKzero/ssgl-doom-launcher/wiki/SSGL---First-Setup#ssgl-data-directory-required"
                fluid
              />
            </Flex.Col>
          </Flex.Grid>
        </FormCollection>

        <FormCollection title={t('settings:titleCustomization')}>
          <Flex.Grid>
            <Flex.Col width="50%">
              <SelectFile
                name="background"
                onFile={onComponent}
                label={t('settings:wallpaper')}
                value={form.background}
                fluid
              />
              <Dropdown
                name="language"
                options={AVAILABLE_LOCALES}
                label={t('common:language')}
                value={form.language}
                onChange={onComponent}
              />
              {gstate.packages.length > 0 ? (
                <Dropdown
                  name="startView"
                  options={viewOptions}
                  label={t('settings:startView')}
                  value={form.startView}
                  onChange={onComponent}
                />
              ) : null}
            </Flex.Col>
            <Flex.Col width="50%">
              <Dropdown
                name="theme"
                options={themeOptions}
                label={t('settings:colorTheme')}
                value={form.theme}
                onChange={onComponent}
              />
              {gstate.sourceports.length > 0 ? (
                <Dropdown
                  name="defaultsourceport"
                  options={sourceportOptions}
                  label={t('settings:favouriteSourceport')}
                  value={form.defaultsourceport}
                  onChange={onComponent}
                  error={errors.defaultsourceport}
                />
              ) : null}
            </Flex.Col>
          </Flex.Grid>
        </FormCollection>

        <FormCollection title={t('settings:titleOblige')}>
          <Checkbox
            value={form.obligeActive}
            label={t('settings:obligeActive')}
            name="obligeActive"
            onChange={onComponent}
            info="https://github.com/FreaKzero/ssgl-doom-launcher/wiki/SSGL---First-Setup#oblige-integration"
          />
          {form.obligeActive ? (
            <Flex.Grid>
              <Flex.Col width="50%">
                <SelectFile
                  name="obligeBinary"
                  onFile={onComponent}
                  label={t('settings:obligeBinary')}
                  value={form.obligeBinary}
                  error={errors.obligeBinary}
                  info="https://github.com/FreaKzero/ssgl-doom-launcher/wiki/SSGL---First-Setup#oblige-binary"
                  fluid
                />
              </Flex.Col>
              <Flex.Col width="50%">
                <SelectFile
                  name="obligeConfigPath"
                  onFile={onComponent}
                  label={t('settings:obligeConfigPath')}
                  value={form.obligeConfigPath}
                  error={errors.obligeConfigPath}
                  info="https://github.com/FreaKzero/ssgl-doom-launcher/wiki/SSGL---First-Setup#oblige-build-configs"
                  directory
                  fluid
                />
              </Flex.Col>
            </Flex.Grid>
          ) : null}
        </FormCollection>

        <SubmitArea>
          <Button type="submit" load={loadInit} width="200px">
            {t('settings:save')}
          </Button>
        </SubmitArea>
      </form>
    </Box>
  );
};

export default Settings;
