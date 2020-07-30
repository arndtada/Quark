package vazkii.quark.base.module;

public interface IConfigType {

	default void onReload(ConfigFlagManager flagManager) { }
	
}
