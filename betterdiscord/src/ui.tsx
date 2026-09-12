import Native from "./native";

const G = globalThis as any;
const Bd = G.BdApi;
if (!Bd) throw new Error("BetterStatus requires BetterDiscord/BdApi.");

const api = new Bd("BetterStatus");
export const React = Bd.React;
export const ReactDOM = Bd.ReactDOM;
export const createRoot = Bd.ReactDOM.createRoot;

function findFunctionByCode(...needles: string[]) {
  try {
    return Bd.Webpack.getModule(
      (value: any) => typeof value === "function" && needles.every(needle => String(value).includes(needle)),
      { searchExports: true }
    );
  } catch {
    return undefined;
  }
}

function findComponentByName(name: string) {
  try {
    return Bd.Webpack.getModule(
      (value: any) => typeof value === "function" && (value.displayName === name || value.name === name),
      { searchExports: true }
    );
  } catch {
    return undefined;
  }
}

const NativeTextInput =
  findFunctionByCode('setHasValue?.(""!==', '="text",') ||
  findComponentByName("TextInput") ||
  Bd.Components?.TextInput;

const NativeSelect =
  findFunctionByCode('selectionMode:"single",onSelectionChange:', "isSelected:") ||
  findComponentByName("Select");

const NativeOAuth2AuthorizeModal =
  findFunctionByCode("hasContentBackground", "nextStep", "onClose?.()") ||
  findComponentByName("OAuth2AuthorizeModal");

const NativeConfirmModal = findComponentByName("ConfirmModal");

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

const buttonColorMapping: Record<string, string> = {
  BRAND: "primary",
  PRIMARY: "secondary",
  RED: "dangerPrimary",
  TRANSPARENT: "secondary",
  CUSTOM: "none",
  GREEN: "positive",
  LINK: "link",
  WHITE: "overlayPrimary"
};

const textButtonColorMapping: Record<string, string> = {
  BRAND: "primary",
  PRIMARY: "primary",
  RED: "danger",
  TRANSPARENT: "secondary",
  CUSTOM: "secondary",
  GREEN: "primary",
  LINK: "link",
  WHITE: "secondary"
};

function normalizeButtonSize(size: any) {
  if (!size) return "medium";
  const value = String(size).toLowerCase();
  if (value === "none" || value === "min") return "min";
  if (value === "small") return "small";
  if (value === "xs") return "xs";
  if (value === "icononly") return "iconOnly";
  return "medium";
}

export function Button(props: any) {
  const {
    look,
    color = "BRAND",
    size = "medium",
    variant,
    className,
    children,
    ...rest
  } = props;

  const linkLook = look === "LINK";
  if (linkLook) {
    const textVariant = textButtonColorMapping[color] || "primary";
    return React.createElement(
      "button",
      { ...rest, className: cx("vc-text-btn-base", `vc-text-btn-${textVariant}`, className) },
      children
    );
  }

  const resolvedVariant = variant || buttonColorMapping[color] || "primary";
  const resolvedSize = normalizeButtonSize(size);
  return React.createElement(
    "button",
    {
      ...rest,
      "data-mana-component": "button",
      className: cx("vc-btn-base", `vc-btn-${resolvedVariant}`, `vc-btn-${resolvedSize}`, className)
    },
    children
  );
}

(Button as any).Looks = { FILLED: "", LINK: "LINK" };
(Button as any).Colors = {
  BRAND: "BRAND",
  PRIMARY: "PRIMARY",
  RED: "RED",
  TRANSPARENT: "TRANSPARENT",
  CUSTOM: "CUSTOM",
  GREEN: "GREEN",
  LINK: "LINK",
  WHITE: "WHITE"
};
(Button as any).Sizes = {
  SMALL: "small",
  MEDIUM: "medium",
  LARGE: "medium",
  XLARGE: "medium",
  NONE: "min",
  MIN: "min"
};

function Switch({ checked, onChange, disabled }: any) {
  const [focusVisible, setFocusVisible] = React.useState(false);
  const handleFocusChange = (event: any) => setFocusVisible(event.currentTarget.matches(":focus-visible"));

  return React.createElement(
    "div",
    null,
    React.createElement(
      "div",
      {
        className: cx(
          "vc-switch-container",
          checked && "vc-switch-checked",
          disabled && "vc-switch-disabled",
          focusVisible && "vc-switch-focusVisible"
        )
      },
      React.createElement(
        "svg",
        {
          className: "vc-switch-slider",
          viewBox: "0 0 28 20",
          preserveAspectRatio: "xMinYMid meet",
          "aria-hidden": true,
          style: { transform: checked ? "translateX(12px)" : "translateX(-3px)" }
        },
        React.createElement("rect", { fill: "white", x: 4, y: 0, height: 20, width: 20, rx: 10 }),
        React.createElement(
          "svg",
          { viewBox: "0 0 20 20", fill: "none" },
          checked
            ? React.createElement(React.Fragment, null,
                React.createElement("path", { fill: "var(--brand-500)", d: "M7.89561 14.8538L6.30462 13.2629L14.3099 5.25755L15.9009 6.84854L7.89561 14.8538Z" }),
                React.createElement("path", { fill: "var(--brand-500)", d: "M4.08643 11.0903L5.67742 9.49929L9.4485 13.2704L7.85751 14.8614L4.08643 11.0903Z" })
              )
            : React.createElement(React.Fragment, null,
                React.createElement("path", { fill: "var(--primary-400)", d: "M5.13231 6.72963L6.7233 5.13864L14.855 13.2704L13.264 14.8614L5.13231 6.72963Z" }),
                React.createElement("path", { fill: "var(--primary-400)", d: "M13.2704 5.13864L14.8614 6.72963L6.72963 14.8614L5.13864 13.2704L13.2704 5.13864Z" })
              )
        )
      ),
      React.createElement("input", {
        onFocus: handleFocusChange,
        onBlur: handleFocusChange,
        disabled,
        type: "checkbox",
        className: "vc-switch-input",
        tabIndex: 0,
        checked: Boolean(checked),
        onChange: (event: any) => onChange?.(event.currentTarget.checked)
      })
    )
  );
}

export function FormSwitch({ title, description, note, value, onChange, disabled, className, hideBorder }: any) {
  const detail = description ?? note;
  return React.createElement(
    "label",
    { className: "vc-form-switch-wrapper" },
    React.createElement(
      "div",
      { className: cx("vc-form-switch", className, disabled && "vc-form-switch-disabled") },
      React.createElement(
        "div",
        { className: "vc-form-switch-text" },
        React.createElement("span", { className: "vc-form-switch-title" }, title),
        detail ? React.createElement("span", { className: "vc-form-switch-description" }, detail) : null
      ),
      React.createElement(Switch, { checked: Boolean(value), onChange, disabled })
    ),
    !hideBorder ? React.createElement("div", { className: "vc-form-switch-border" }) : null
  );
}

export function TextInput(props: any) {
  if (NativeTextInput) return React.createElement(NativeTextInput, props);
  const { onChange, ...rest } = props;
  return React.createElement("input", {
    ...rest,
    className: cx("bs-bd-text-input", props.className),
    onChange: (event: any) => onChange?.(event.currentTarget.value)
  });
}

export function Select(props: any) {
  if (NativeSelect) return React.createElement(NativeSelect, props);

  const { options = [], select, serialize, isSelected, ...rest } = props;
  const selected = options.find((option: any) => isSelected?.(option.value))?.value ?? props.value ?? options[0]?.value;
  return React.createElement(
    "select",
    {
      ...rest,
      className: cx("bs-bd-select", props.className),
      value: serialize ? serialize(selected) : selected,
      onChange: (event: any) => {
        const raw = event.currentTarget.value;
        const option = options.find((candidate: any) => String(serialize ? serialize(candidate.value) : candidate.value) === raw);
        select?.(option ? option.value : raw);
      }
    },
    options.map((option: any) => React.createElement(
      "option",
      { key: String(serialize ? serialize(option.value) : option.value), value: String(serialize ? serialize(option.value) : option.value), disabled: option.disabled },
      option.label
    ))
  );
}

export const Forms = {
  FormTitle({ children, className = "", ...rest }: any) {
    return React.createElement("h5", { ...rest, className: cx("vc-form-title", className) }, children);
  },
  FormText({ children, className = "", ...rest }: any) {
    return React.createElement("div", { ...rest, className: cx("vc-form-text", className) }, children);
  }
};

function findModalActions() {
  try {
    return Bd.Webpack.getByKeys?.("openModal", "closeModal") ||
      Bd.Webpack.getModule((module: any) => typeof module?.openModal === "function" && typeof module?.closeModal === "function");
  } catch {
    return undefined;
  }
}

export function openModal(renderer: (props: any) => any) {
  const actions = findModalActions();
  if (actions?.openModal) return actions.openModal(renderer);
  const content = renderer({ onClose() {}, transitionState: 1 });
  return api.UI.showConfirmationModal("BetterStatus", content, { confirmText: null, cancelText: "Close" });
}

export function ConfirmModal(props: any) {
  if (NativeConfirmModal) return React.createElement(NativeConfirmModal, props);

  const [error, setError] = React.useState("");
  const confirm = async () => {
    try {
      setError("");
      await props.onConfirm?.(setError);
      props.onClose?.();
    } catch (failure: any) {
      setError((current: string) => current || failure?.message || String(failure));
    }
  };

  return React.createElement(
    "div",
    { className: "bs-bd-fallback-modal" },
    React.createElement("h2", null, props.title),
    props.children,
    error ? React.createElement("div", { className: "bs-bd-modal-error" }, error) : null,
    React.createElement(
      "div",
      { className: "bs-bd-modal-actions" },
      React.createElement(Button, { onClick: confirm }, props.confirmText || "Confirm"),
      React.createElement(Button, { color: Button.Colors.PRIMARY, onClick: () => { props.onCancel?.(); props.onClose?.(); } }, props.cancelText || "Cancel")
    )
  );
}

export function OAuth2AuthorizeModal(props: any) {
  if (NativeOAuth2AuthorizeModal) return React.createElement(NativeOAuth2AuthorizeModal, props);

  return React.createElement(
    "div",
    { className: "bs-password-modal" },
    React.createElement(Forms.FormText, null, "Authorize BetterStatus with Discord in your browser, then return here."),
    React.createElement(Button, {
      onClick: async () => {
        try {
          await Native.openExternalAuthorization(props.state);
          await props.callback?.({ location: "betterstatus-external" });
        } catch (error: any) {
          api.UI.showToast(error?.message || String(error), { type: "error" });
        }
      }
    }, "Authorize with Discord")
  );
}
