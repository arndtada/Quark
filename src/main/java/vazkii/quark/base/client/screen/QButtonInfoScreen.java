package vazkii.quark.base.client.screen;

import net.minecraft.client.Minecraft;
import net.minecraft.client.gui.screen.ConfirmScreen;
import net.minecraft.client.gui.screen.Screen;
import net.minecraft.client.resources.I18n;
import net.minecraft.util.text.TranslationTextComponent;
import vazkii.quark.base.client.QButtonHandler;

public class QButtonInfoScreen extends ConfirmScreen {

	public QButtonInfoScreen(final Screen parent) {
		super(b -> {
			if(b)
				QButtonHandler.openFile();

			Minecraft.getInstance().displayGuiScreen(parent);
		}, 
				new TranslationTextComponent("quark.gui.qbutton_info.title"), 
				new TranslationTextComponent("quark.gui.qbutton_info", Minecraft.getInstance().getVersion()), 
				new TranslationTextComponent("quark.gui.qbutton_info.open"), 
				new TranslationTextComponent("quark.gui.qbutton_info.back"));
	}
}
