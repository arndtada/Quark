package vazkii.quark.automation.module;

import net.minecraft.block.Blocks;
import vazkii.quark.automation.block.ColorSlimeBlock;
import vazkii.quark.automation.block.ColorSlimeBlock.SlimeColor;
import vazkii.quark.base.handler.ItemOverrideHandler;
import vazkii.quark.base.module.Config;
import vazkii.quark.base.module.LoadModule;
import vazkii.quark.base.module.Module;
import vazkii.quark.base.module.ModuleCategory;

@LoadModule(category = ModuleCategory.AUTOMATION)
public class ColorSlimeModule extends Module {

	@Config
	public static boolean changeName = true;

	@Override
	public void construct() {
		for (SlimeColor color : SlimeColor.values())
			new ColorSlimeBlock(color, this);
	}

	@Override
	public void configChanged() {
		ItemOverrideHandler.changeBlockLocalizationKey(Blocks.SLIME_BLOCK, "block.quark.green_slime_block", changeName && enabled);
	}

}
